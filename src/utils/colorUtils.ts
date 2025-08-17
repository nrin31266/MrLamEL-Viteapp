const colors = [
  { backgroundColor: "#1abc9c", textColor: "white" },   // teal
  { backgroundColor: "#16a085", textColor: "white" },   // dark teal
  { backgroundColor: "#2ecc71", textColor: "white" },   // green
  { backgroundColor: "#27ae60", textColor: "white" },   // dark green
  { backgroundColor: "#3498db", textColor: "white" },   // blue
  { backgroundColor: "#2980b9", textColor: "white" },   // dark blue
  { backgroundColor: "#9b59b6", textColor: "white" },   // purple
  { backgroundColor: "#8e44ad", textColor: "white" },   // dark purple
  { backgroundColor: "#e67e22", textColor: "white" },   // orange
  { backgroundColor: "#d35400", textColor: "white" },   // dark orange
  { backgroundColor: "#e74c3c", textColor: "white" },   // red
  { backgroundColor: "#c0392b", textColor: "white" },   // dark red
  { backgroundColor: "#34495e", textColor: "white" },   // dark gray-blue
  { backgroundColor: "#2c3e50", textColor: "white" },   // darker navy
  { backgroundColor: "#7f8c8d", textColor: "white" },   // gray
  { backgroundColor: "#95a5a6", textColor: "black" },   // light gray
  { backgroundColor: "#f39c12", textColor: "black" },   // amber
  { backgroundColor: "#d35400", textColor: "white" },   // burnt orange
  { backgroundColor: "#16a085", textColor: "white" },   // deep cyan
  { backgroundColor: "#2d3436", textColor: "white" },   // charcoal
];


export const getColorByName = (name: string) : { backgroundColor: string, textColor: string } => {
  const index = (name.charCodeAt(name.length - 1) * 3) % colors.length;
  return colors[index];
};
