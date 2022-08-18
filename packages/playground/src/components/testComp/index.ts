import A from "./A.vue";
import B from "./B.vue";
import { registerComponent } from "../../js/register";

registerComponent(A, "测试组件1", "test1", "normal");
registerComponent(B, "测试组件2", "test2", "normal");
