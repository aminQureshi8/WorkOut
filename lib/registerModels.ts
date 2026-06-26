import Subscription from "@/model/Subscription";
import Package from "@/model/Package";
import Coach from "@/model/Coach";
import Order from "@/model/Order";
import User from "@/model/User";
import WorkoutPlan from "@/model/WorkoutPlan";
import WorkoutDay from "@/model/WorkoutDay";
import WorkoutExercise from "@/model/WorkoutExercise";
import Video from "@/model/Video";

export default function registerModels() {
  return [
    Subscription,
    Package,
    Coach,
    Order,
    User,
    WorkoutPlan,
    WorkoutDay,
    WorkoutExercise,
    Video,
  ];
}
