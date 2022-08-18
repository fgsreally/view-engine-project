<script lang="ts">
import { defineComponent } from "vue";
import { BlockType } from "../js/init";
import { getModule } from "@fgsreally/view-engine";
import { registerModule } from "../js/register";
export default defineComponent({
  name: "render",
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    return () => {
      return (props.value as BlockType[]).map((item: BlockType) => {
        return (getModule(item.key) as registerModule).render(item);
      });
    };
  },
});
</script>
