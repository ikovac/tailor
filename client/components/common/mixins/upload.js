import downloadMixin from 'utils/downloadMixin';
import loader from '@/components/common/loader';
import { mapRequests } from '@/plugins/radio';

export default {
  inject: ['$storageService'],
  mixins: [downloadMixin],
  data: () => ({ uploading: false }),
  methods: {
    ...mapRequests('app', ['showConfirmationModal']),
    createFileForm(e) {
      this.form = new FormData();
      const [file] = e.target.files;
      if (!file) return;
      this.form.append('file', file, file.name);
    },
    upload: loader(function (e) {
      this.createFileForm(e);
      return this.$storageService.upload(this.form)
        .then(({ url, publicUrl, key }) => {
          const { name } = this.form.get('file');
          this.$emit('upload', { url, publicUrl, key, name });
        }).catch(() => {
          this.error = 'An error has occurred!';
        });
    }, 'uploading'),
    async downloadFile(key, name) {
      const url = await this.$storageService.getUrl(key);
      return this.download(url, name);
    },
    deleteFile(item) {
      this.showConfirmationModal({
        title: 'Delete file?',
        message: `Are you sure you want to remove ${item.fileName}?`,
        action: () => this.$emit('delete', item.id, null)
      });
    }
  }
};
