<template>
  <div class="content-containers">
    <h2 v-if="displayHeading" class="headline">{{ name | capitalize }}</h2>
    <v-alert
      :value="!containerGroup.length"
      color="blue-grey darken-4"
      icon="mdi-information-variant"
      prominent text>
      Click the button below to create first {{ name | capitalize }}.
    </v-alert>
    <component
      :is="containerName"
      v-for="(container, index) in containerGroup"
      :key="container.uid || container.id"
      @addSubcontainer="save"
      @updateSubcontainer="update"
      @deleteSubcontainer="requestContainerDeletion"
      @addElement="addElement"
      @saveElement="saveContentElement"
      @updateElement="updateElement"
      @reorderElement="reorderContentElements"
      @deleteElement="requestElementDeletion"
      @delete="requestContainerDeletion(container)"
      :container="container"
      :name="name"
      :position="index"
      :activities="activities"
      :elements="elements"
      :tes="elements"
      v-bind="$attrs" />
    <div v-if="addBtnEnabled">
      <v-btn @click="addContainer" color="blue-grey darken-3" text class="mt-4">
        <v-icon class="pr-2">mdi-plus</v-icon>
        Create {{ name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import capitalize from 'lodash/capitalize';
import ContentContainer from './Container';
import get from 'lodash/get';
import { getContainerTemplateId as getContainerId } from 'shared/activities';
import { getContainerName } from 'tce-core/utils';
import isEmpty from 'lodash/isEmpty';
import { mapRequests } from '@/plugins/radio';
import maxBy from 'lodash/maxBy';
import throttle from 'lodash/throttle';

const DEFAULT_CONTAINER = 'content-container';

export default {
  name: 'content-containers',
  inheritAttrs: false,
  inject: ['$ccRegistry'],
  props: {
    containerGroup: { type: Array, default() { return []; } },
    type: { type: String, required: true },
    templateId: { type: String, default: null },
    parentId: { type: Number, required: true },
    label: { type: String, required: true },
    required: { type: Boolean, default: true },
    multiple: { type: Boolean, default: false },
    displayHeading: { type: Boolean, default: false }
  },
  computed: {
    ...mapState('repository/activities', { activities: 'items' }),
    ...mapState('repository/contentElements', { elements: 'items' }),
    containerName() {
      const id = getContainerId(this);
      return this.$ccRegistry.get(id) ? getContainerName(id) : DEFAULT_CONTAINER;
    },
    name() {
      return this.label.toLowerCase();
    },
    addBtnEnabled() {
      return !(!this.multiple && this.containerGroup.length);
    },
    nextPosition() {
      const last = get(maxBy(this.containerGroup, 'position'), 'position', 0);
      return last + 1;
    }
  },
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    ...mapActions('repository/activities', ['save', 'update', 'remove']),
    ...mapActions('repository/contentElements', {
      addElement: 'add',
      saveElement: 'save',
      updateElement: 'update',
      reorderElements: 'reorder',
      deleteElement: 'remove'
    }),
    addContainer() {
      const { type, parentId, nextPosition: position } = this;
      this.save({ type, parentId, position });
    },
    saveContentElement(element) {
      return this.saveElement(element).then(() => this.showNotification());
    },
    reorderContentElements({ newPosition, items }) {
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    requestDeletion(content, action, name) {
      this.showConfirmationModal({
        title: `Delete ${name}?`,
        message: `Are you sure you want to delete ${name}?`,
        action: () => this[action](content)
      });
    },
    requestContainerDeletion(container, name = this.name) {
      this.requestDeletion(container, 'remove', name);
    },
    requestElementDeletion(element) {
      this.requestDeletion(element, 'deleteElement', 'element');
    },
    showNotification: throttle(function () {
      this.$snackbar.show('Element saved');
    }, 4000)
  },
  created() {
    if (this.required && isEmpty(this.containerGroup)) this.addContainer();
  },
  filters: {
    capitalize
  },
  components: { ContentContainer }
};
</script>

<style lang="scss" scoped>
.content-containers {
  margin: 4.375rem 0;
}

.headline {
  margin: 3.125rem 0 1.25rem;
  padding: 0;
  text-align: left;
}

.content-container {
  width: 100%;
  min-height: 15.5rem;
  margin: 1.5rem 0;
  padding: 0.625rem;
  background-color: #fff;
}
</style>
