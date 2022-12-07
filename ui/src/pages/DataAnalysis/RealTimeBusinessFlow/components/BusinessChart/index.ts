// import { lazy } from "react";

// // './BusinessChart' 该组件将被自动拆出去
// const aaa = lazy(() => import("./BusinessChart"));

// export const BusinessEChart = async () => {
//   const { default: Business } = await import(
//     /* webpackChunkName: "echarts-realTime-traffic" */ "./BusinessChart"
//   );
//   console.log(Business, "BoardChart", await import("./BusinessChart"), aaa);
//   return Business;
// };

// // export const BusinessEChart = dynamic({
// //   loader: async function () {
// //     // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
// //     return BusinessEChart;
// //   },
// // });
