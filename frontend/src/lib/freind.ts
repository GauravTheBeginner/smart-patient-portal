import friends from "@/lib/life";

const life: typeof friends = [];

life.splice(0, life.length, ...life.filter(f => f.vibes !== "Toxic"));

export default life;
