<template>
  <div class="tce-brightcove-video">
    <element-placeholder
      v-if="showPlaceholder"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      name="Brightcove video component"
      icon="mdi-video"
      active-placeholder="Use toolbar to set the video parameters"
      active-icon="mdi-arrow-up" />
    <div v-else>
      <div v-if="!isDisabled && !isFocused" class="overlay">
        <div class="message grey--text text--lighten-2">Double click to preview</div>
      </div>
      <brightcove-player
        ref="player"
        v-bind="config"
        class="player" />
    </div>
  </div>
</template>

<script>
import BrightcovePlayer from './Player';
import { ElementPlaceholder } from 'tce-core';
import get from 'lodash/get';

export default {
  name: 'tce-brightcove-video',
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false }
  },
  computed: {
    showPlaceholder() {
      const config = this.config;
      return !(config.accountId && config.playerId && config.videoId);
    },
    config() {
      return get(this.element, 'data', {});
    }
  },
  watch: {
    isFocused(val, oldVal) {
      if (oldVal && !val && this.$refs.player) this.$refs.player.pause();
    }
  },
  components: { BrightcovePlayer, ElementPlaceholder }
};
</script>

<style lang="scss" scoped>
.tce-brightcove-video {
  position: relative;
}

.overlay {
  position: absolute;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: #111;
  opacity: 0.9;

  .message {
    position: relative;
    top: 45%;
    font-size: 1.125rem;
  }
}

.player ::v-deep .video-js .vjs-big-play-button {
  display: none;
}
</style>
