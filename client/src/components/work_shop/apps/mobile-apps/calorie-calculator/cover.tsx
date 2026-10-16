import { Flame } from "lucide-react";
import "./calorie-calculator.scss";

export function CalorieCalculatorCover() {
  return (
    <div className="calorie-cover" aria-hidden="true">
      <div className="calorie-cover__brand"><Flame size={22} /><strong>РИТМ<span>.</span></strong></div>
      <div className="calorie-cover__ring"><span><b>1 480</b><small>ккал за день</small></span></div>
      <div className="calorie-cover__macros">
        <span><i />Белки<b>86 г</b></span>
        <span><i />Жиры<b>48 г</b></span>
        <span><i />Углеводы<b>176 г</b></span>
      </div>
      <small className="calorie-cover__caption">Питание в вашем ритме</small>
    </div>
  );
}
