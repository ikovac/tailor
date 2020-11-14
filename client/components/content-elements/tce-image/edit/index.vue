<template>
  <div class="tce-image">
    <v-alert
      @click:close="error = null"
      :value="!!error"
      color="error"
      icon="mdi-alert"
      dark dismissible
      class="mb-12">
      {{ error }}
    </v-alert>
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      :dense="dense"
      name="Image component"
      icon="mdi-image-plus"
      active-placeholder="Use toolbar to upload the image"
      active-icon="mdi-arrow-up" />
    <div v-else :class="{ 'hide-cropper': !showCropper }" class="image-wrapper">
      <cropper
        v-show="showCropper"
        ref="cropper"
        :view-mode="2"
        :auto-crop-area="0.5"
        :auto-crop="false"
        :guides="true"
        :ready="onReady"
        :responsive="true"
        :rotatable="false"
        :background="false"
        :zoomable="false"
        :scalable="false"
        :movable="false"
        :modal="false"
        :src="currentImageSrc"
        drag-mode="none" />
      <img v-show="!showCropper" :src="currentImageSrc" class="preview-image">
    </div>
    <v-progress-linear
      v-if="isUploading"
      indeterminate
      color="primary" />
  </div>
</template>

<script>
import api from '../api';
import Cropper from './Cropper';
import { ElementPlaceholder } from 'tce-core';
import { imgSrcToDataURL } from 'blob-util';
import isEmpty from 'lodash/isEmpty';

function toDataUrl(imageUrl) {
  if (!imageUrl) return Promise.resolve(imageUrl);
  return imgSrcToDataURL(imageUrl, 'image/png', 'Anonymous');
}

export default {
  name: 'tce-image',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
    dense: { type: Boolean, default: false }
  },
  data: () => ({
    currentImageSrc: null,
    persistedImageSrc: null,
    imageName: null,
    currentImage: null,
    persistedImage: null,
    showCropper: false,
    isUploading: false,
    error: null
  }),
  computed: {
    showPlaceholder() {
      const imageAvailable = !isEmpty(this.element.data.url);
      if (imageAvailable) return false;
      if (this.$refs.cropper) this.$refs.cropper.destroy();
      return true;
    }
  },
  methods: {
    onReady() {
      if (!this.showCropper || !this.$refs.cropper) return;
      this.$refs.cropper.show();
    },
    load(dataUrl) {
      this.currentImageSrc = dataUrl;
      this.persistedImageSrc = dataUrl;
      this.currentImage = null;
      this.persistedImage = null;
      if (dataUrl && this.$refs.cropper) this.$refs.cropper.replace(dataUrl);
    },
    save() {
      const formData = new FormData();
      formData.append('images', this.currentImage, this.imageName);
      formData.append('placeholder', true);
      this.isUploading = true;
      api.upload(formData)
        .then(images => {
          if (isEmpty(images)) return;
          const { src: url, key: name, width, height, placeholder } = images[0];
          this.$emit('save', { url, name, placeholder, meta: { width, height } });
        })
        .catch(() => { this.error = 'Something went wrong'; })
        .finally(() => { this.isUploading = false; });
    }
  },
  watch: {
    isFocused(focused) {
      if (focused) return;
      if (this.persistedImageSrc !== this.currentImageSrc) this.save();
      if (this.currentImageSrc) this.$refs.cropper.clear();
    },
    'element.data.url'(imageUrl) {
      toDataUrl(imageUrl).then(dataUrl => this.load(dataUrl));
    }
  },
  mounted() {
    toDataUrl(this.element.data.url)
      .then(dataUrl => this.load(dataUrl));
    this.imageName = this.element.data.key;

    this.$elementBus.on('upload', ({ dataUrl, image }) => {
      if (this.currentImageSrc) this.$refs.cropper.replace(dataUrl);
      this.currentImageSrc = dataUrl;
      this.persistedImageSrc = dataUrl;
      this.imageName = image.name;
      this.currentImage = image;
      this.persistedImage = image;
      this.save();
    });

    this.$elementBus.on('showCropper', () => {
      this.showCropper = true;
      this.$refs.cropper.show();
    });

    this.$elementBus.on('hideCropper', () => {
      this.showCropper = false;
      this.$refs.cropper.clear();
    });

    this.$elementBus.on('crop', () => {
      this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
        this.currentImage = blob;
        this.currentImageSrc = this.$refs.cropper.getCroppedCanvas().toDataURL();
        this.$refs.cropper.replace(this.currentImageSrc);
      });
    });

    this.$elementBus.on('undo', () => {
      this.currentImageSrc = this.persistedImageSrc;
      this.currentImage = this.persistedImage;
      this.$refs.cropper.replace(this.persistedImageSrc);
    });
  },
  beforeDestroy() {
    if (this.$refs.cropper) this.$refs.cropper.destroy();
  },
  components: { Cropper, ElementPlaceholder }
};
</script>

<style lang="scss" scoped>
.hide-cropper ::v-deep .cropper-container {
  display: none;
}

img {
  max-width: 100%;
}
</style>
