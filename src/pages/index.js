import VisualDemo from "./visualDemo";
import visualStyles from "@/styles/visualDemo.module.css";

export default function Home() {
  return (
    <div>
      <VisualDemo className={visualStyles} />
    </div>
  );
}
