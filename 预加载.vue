<script setup>
mounted() {
  this.preloadBPage();
},
methods: {
  async preloadBPage() {
    // 异步加载B页面的资源
    await import(/* webpackChunkName: "b-page" */ '@/views/BPage');
  }
}
</script>
