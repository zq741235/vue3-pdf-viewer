<template>
  <canvas ref="convas"></canvas>
</template>

<script>
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?worker&url" 
pdfjsLib.GlobalWorkerOptions.workerSrc = `/node_modules/vue3-pdf-viewer/dist${pdfjsWorker}`
const CMAP_URL = "/node_modules/vue3-pdf-viewer/dist/cmaps/";
const CMAP_PACKED = true;
export default {
  name: "PdfViewer",
  props: {
    src: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  mounted() {
    const url = this.src;
    const $convas = this.$refs.convas;
    // 加载 PDF 文档
    pdfjsLib
      .getDocument({
        url,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
      })
      .promise.then((pdf) => {
        // console.log("PDF loaded", pdf);
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function (page) {
          // console.log("Page loaded");

          // 获取视口宽度
          var viewportWidth = window.innerWidth;

          // 默认 PDF 页面视口
          var viewport = page.getViewport({ scale: 1 });

          // 我们先将 PDF 放大 2 倍，以提升渲染的清晰度
          var scale = 1; // 你可以调整 scale 值
          var scaledViewport = page.getViewport({ scale: scale });

          // 准备 canvas 并渲染高分辨率 PDF 页面
          // var canvas = document.getElementById("the-canvas");
          var canvas = $convas;
          var context = canvas.getContext("2d");

          // 提升渲染分辨率，适配高 DPI 屏幕（如 Retina 屏幕）
          var outputScale = window.devicePixelRatio || 1;

          // 设置 canvas 的物理像素大小，按比例放大
          canvas.width = Math.floor(scaledViewport.width * outputScale);
          canvas.height = Math.floor(scaledViewport.height * outputScale);

          // 设置 canvas 的 CSS 尺寸，缩小到适应视口宽度
          canvas.style.width = Math.floor(viewportWidth) + "px";
          canvas.style.height =
            Math.floor(
              (viewportWidth / scaledViewport.width) * scaledViewport.height
            ) + "px";

          // 对 canvas 进行缩放，适配高 DPI 屏幕
          context.scale(outputScale, outputScale);
          var renderContext = {
            canvasContext: context,
            viewport: scaledViewport,
          };
          var renderTask = page.render(renderContext);
          // renderTask.promise.then(function () {
          //   console.log("Page rendered");
          // });
        });
      });
  },
  methods: {},
};
</script>
