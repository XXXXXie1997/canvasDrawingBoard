import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import drawingBoard from "../views/drawingBoard.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "drawingBoard",
    component: drawingBoard,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
