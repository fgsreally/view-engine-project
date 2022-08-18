<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "preview",
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    return () => {
      return props.value.preview();
    };
  },
});
</script>
