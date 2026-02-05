import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ============ FONTS ============
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Comfortaa:wght@400;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// ============ DATA ============
const CHARACTERS = {
  male: {
    name: "Архимед", emoji: "🧑‍🔬", color: "#4F8CFF",
    greeting: "Привет! Я Архимед — твой проводник в мир геометрии!",
    encouragement: ["Отлично! Ты на верном пути! 🔥","Так держать, будущий математик! 💪","Мозг прокачивается! Евклид бы гордился! 🧠","Супер! Ещё чуть-чуть и ты станешь гением! ⭐"],
    wrong: ["Не переживай, ошибки — это ступеньки к знаниям!","Попробуй ещё раз, я в тебя верю!","Каждый великий учёный ошибался. Давай снова!"],
  },
  female: {
    name: "Гипатия", emoji: "👩‍🔬", color: "#FF6B9D",
    greeting: "Привет! Я Гипатия — вместе мы покорим геометрию!",
    encouragement: ["Великолепно! Ты просто звезда! ⭐","Потрясающе! Мне нравится ход твоих мыслей! 💫","Браво! Ты схватываешь на лету! 🎯","Умница! Ещё немного и теоремы сдадутся! 🏆"],
    wrong: ["Ничего страшного! Давай разберёмся вместе!","Это сложная тема, но ты справишься! 💪","Ошибка — это шанс понять глубже. Попробуй ещё!"],
  },
};

const GRADES = [
  { id: 7, label: "7 класс", icon: "📐", topics: 10, description: "Начальная геометрия, треугольники, углы" },
  { id: 8, label: "8 класс", icon: "📏", topics: 10, description: "Четырёхугольники, площади, подобие" },
  { id: 9, label: "9 класс", icon: "📊", topics: 8, description: "Векторы, окружность, движения" },
  { id: 1011, label: "10–11 класс", icon: "🎓", topics: 10, description: "Стереометрия, тела вращения, координаты" },
];

const TOPICS_BY_GRADE = {
  7: [
    { id: "t7_1", title: "Точки, прямые, отрезки", icon: "📍" },
    { id: "t7_2", title: "Углы и их виды", icon: "📐" },
    { id: "t7_3", title: "Смежные и вертикальные углы", icon: "🔄" },
    { id: "t7_4", title: "Треугольник и его элементы", icon: "🔺" },
    { id: "t7_5", title: "Медиана, биссектриса, высота", icon: "⬆️" },
    { id: "t7_6", title: "Признаки равенства треугольников", icon: "⚖️" },
    { id: "t7_7", title: "Равнобедренный треугольник", icon: "🔻" },
    { id: "t7_8", title: "Параллельные прямые", icon: "═" },
    { id: "t7_9", title: "Сумма углов треугольника", icon: "Σ" },
    { id: "t7_10", title: "Прямоугольный треугольник", icon: "📏" },
  ],
  8: [
    { id: "t8_1", title: "Параллелограмм", icon: "▱" },
    { id: "t8_2", title: "Прямоугольник, ромб, квадрат", icon: "⬜" },
    { id: "t8_3", title: "Трапеция", icon: "⏢" },
    { id: "t8_4", title: "Площадь многоугольника", icon: "📐" },
    { id: "t8_5", title: "Теорема Пифагора", icon: "🏛️" },
    { id: "t8_6", title: "Подобные треугольники", icon: "🔍" },
    { id: "t8_7", title: "Признаки подобия", icon: "⚖️" },
    { id: "t8_8", title: "Окружность", icon: "⭕" },
    { id: "t8_9", title: "Вписанные углы", icon: "🎯" },
    { id: "t8_10", title: "Касательная к окружности", icon: "➡️" },
  ],
  9: [
    { id: "t9_1", title: "Векторы", icon: "➡️" },
    { id: "t9_2", title: "Метод координат", icon: "📊" },
    { id: "t9_3", title: "Соотношения в треугольнике", icon: "📐" },
    { id: "t9_4", title: "Скалярное произведение", icon: "✖️" },
    { id: "t9_5", title: "Правильные многоугольники", icon: "⬡" },
    { id: "t9_6", title: "Длина окружности и площадь круга", icon: "🔵" },
    { id: "t9_7", title: "Движения (симметрия, поворот)", icon: "🔄" },
    { id: "t9_8", title: "Теоремы синусов и косинусов", icon: "📏" },
  ],
  1011: [
    { id: "t10_1", title: "Аксиомы стереометрии", icon: "📦" },
    { id: "t10_2", title: "Параллельность в пространстве", icon: "═" },
    { id: "t10_3", title: "Перпендикулярность прямых и плоскостей", icon: "⊥" },
    { id: "t10_4", title: "Двугранные углы", icon: "📐" },
    { id: "t10_5", title: "Многогранники (призма, пирамида)", icon: "🔺" },
    { id: "t10_6", title: "Тела вращения (цилиндр, конус, шар)", icon: "🌐" },
    { id: "t10_7", title: "Объёмы тел", icon: "📏" },
    { id: "t10_8", title: "Площадь поверхности", icon: "🧮" },
    { id: "t10_9", title: "Координаты в пространстве", icon: "📊" },
    { id: "t10_10", title: "Векторы в пространстве", icon: "➡️" },
  ],
};

// ============ GEOMETRY HELPERS ============
function midpoint(p1, p2) { return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }; }
function footOfPerpendicular(P, A, B) {
  const dx = B.x - A.x, dy = B.y - A.y;
  const t = ((P.x - A.x) * dx + (P.y - A.y) * dy) / (dx * dx + dy * dy);
  return { x: A.x + t * dx, y: A.y + t * dy };
}
function angleBisectorPoint(vertex, p1, p2) {
  const d1 = Math.hypot(p1.x - vertex.x, p1.y - vertex.y);
  const d2 = Math.hypot(p2.x - vertex.x, p2.y - vertex.y);
  const u1 = { x: (p1.x - vertex.x) / d1, y: (p1.y - vertex.y) / d1 };
  const u2 = { x: (p2.x - vertex.x) / d2, y: (p2.y - vertex.y) / d2 };
  const bx = u1.x + u2.x, by = u1.y + u2.y;
  const bLen = Math.hypot(bx, by);
  const dir = { x: bx / bLen, y: by / bLen };
  const A = vertex, B = { x: vertex.x + dir.x * 500, y: vertex.y + dir.y * 500 };
  const C = p1, D = p2;
  const denom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
  if (Math.abs(denom) < 0.001) return midpoint(p1, p2);
  const t = ((D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x)) / denom;
  return { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y) };
}
function angleOf(cx, cy, px, py) { return Math.atan2(py - cy, px - cx); }

// ============ EXERCISES ============
const EXERCISES = {
  t7_5: {
    title: "Медиана, биссектриса, высота",
    theory: `📖 **Запомни три главных отрезка треугольника:**

🔹 **Медиана** — отрезок из вершины к середине противоположной стороны. Делит сторону на два равных отрезка!

🔹 **Биссектриса** — отрезок из вершины, который делит угол при этой вершине пополам.

🔹 **Высота** — перпендикуляр из вершины к противоположной стороне. Образует прямой угол (90°).

💡 **Лайфхаки для запоминания:**

• Медиана — «к Медиане Медиана» (оба слова на «м» → к середине)
• Биссектриса — «крыса-биссектриса бежит в угол и делит его пополам»
• Высота — «падает строго вниз как столб» → прямой угол`,
    questions: [
      {
        id:"q1", type:"select_line", hintType:"median",
        prompt:"Найди медиану из вершины B",
        triangle:{ A:{x:30,y:250}, B:{x:140,y:40}, C:{x:320,y:270} },
        getLinesFromTriangle:(tri)=>{
          const M=midpoint(tri.A,tri.C), H=footOfPerpendicular(tri.B,tri.A,tri.C), D=angleBisectorPoint(tri.B,tri.A,tri.C);
          return [
            {id:"BM",toPoint:M,label:"BM",description:"B → M (середина AC)",type:"median",vertex:"B",side:["A","C"]},
            {id:"BH",toPoint:H,label:"BH",description:"B → H (⊥ к AC)",type:"height",vertex:"B",side:["A","C"]},
            {id:"BD",toPoint:D,label:"BD",description:"B → D (делит ∠B пополам)",type:"bisector",vertex:"B",side:["A","C"]},
          ];
        },
        correct:"BM",
        explanation:"Медиана BM идёт из вершины B в середину стороны AC. Точка M делит AC на два равных отрезка: AM = MC ✅",
      },
      {
        id:"q2", type:"select_line", hintType:"height",
        prompt:"Найди высоту из вершины A",
        triangle:{ A:{x:70,y:50}, B:{x:30,y:280}, C:{x:310,y:260} },
        getLinesFromTriangle:(tri)=>{
          const M=midpoint(tri.B,tri.C), H=footOfPerpendicular(tri.A,tri.B,tri.C), D=angleBisectorPoint(tri.A,tri.B,tri.C);
          return [
            {id:"AD",toPoint:D,label:"AD",description:"A → D (делит ∠A пополам)",type:"bisector",vertex:"A",side:["B","C"]},
            {id:"AH",toPoint:H,label:"AH",description:"A → H (⊥ к BC)",type:"height",vertex:"A",side:["B","C"]},
            {id:"AM",toPoint:M,label:"AM",description:"A → M (середина BC)",type:"median",vertex:"A",side:["B","C"]},
          ];
        },
        correct:"AH",
        explanation:"Высота AH — это перпендикуляр из вершины A к стороне BC. Она образует прямой угол (90°) со стороной BC ✅",
      },
      {
        id:"q3", type:"select_line", hintType:"bisector",
        prompt:"Найди биссектрису угла C",
        triangle:{ A:{x:40,y:100}, B:{x:160,y:270}, C:{x:320,y:60} },
        getLinesFromTriangle:(tri)=>{
          const M=midpoint(tri.A,tri.B), H=footOfPerpendicular(tri.C,tri.A,tri.B), D=angleBisectorPoint(tri.C,tri.A,tri.B);
          return [
            {id:"CM",toPoint:M,label:"CM",description:"C → M (середина AB)",type:"median",vertex:"C",side:["A","B"]},
            {id:"CH",toPoint:H,label:"CH",description:"C → H (⊥ к AB)",type:"height",vertex:"C",side:["A","B"]},
            {id:"CD",toPoint:D,label:"CD",description:"C → D (делит ∠C пополам)",type:"bisector",vertex:"C",side:["A","B"]},
          ];
        },
        correct:"CD",
        explanation:"Биссектриса CD делит угол C на два равных угла: ∠ACD = ∠DCB. Обрати внимание на одинаковые дуги! ✅",
      },
      {
        id:"q4", type:"select_line", hintType:"median",
        prompt:"Найди медиану из вершины C",
        triangle:{ A:{x:50,y:260}, B:{x:200,y:40}, C:{x:310,y:280} },
        getLinesFromTriangle:(tri)=>{
          const M=midpoint(tri.A,tri.B), H=footOfPerpendicular(tri.C,tri.A,tri.B), D=angleBisectorPoint(tri.C,tri.A,tri.B);
          return [
            {id:"CH",toPoint:H,label:"CH",description:"C → H (⊥ к AB)",type:"height",vertex:"C",side:["A","B"]},
            {id:"CM",toPoint:M,label:"CM",description:"C → M (середина AB)",type:"median",vertex:"C",side:["A","B"]},
            {id:"CD",toPoint:D,label:"CD",description:"C → D (делит ∠C пополам)",type:"bisector",vertex:"C",side:["A","B"]},
          ];
        },
        correct:"CM",
        explanation:"Медиана CM соединяет вершину C с серединой стороны AB. Точка M — середина, AM = MB ✅",
      },
      {
        id:"q5", type:"select_line", hintType:"height",
        prompt:"Найди высоту из вершины B",
        triangle:{ A:{x:40,y:270}, B:{x:260,y:35}, C:{x:300,y:270} },
        getLinesFromTriangle:(tri)=>{
          const M=midpoint(tri.A,tri.C), H=footOfPerpendicular(tri.B,tri.A,tri.C), D=angleBisectorPoint(tri.B,tri.A,tri.C);
          return [
            {id:"BM",toPoint:M,label:"BM",description:"B → M (середина AC)",type:"median",vertex:"B",side:["A","C"]},
            {id:"BD",toPoint:D,label:"BD",description:"B → D (делит ∠B пополам)",type:"bisector",vertex:"B",side:["A","C"]},
            {id:"BH",toPoint:H,label:"BH",description:"B → H (⊥ к AC)",type:"height",vertex:"B",side:["A","C"]},
          ];
        },
        correct:"BH",
        explanation:"Высота BH — перпендикуляр из B к стороне AC. Прямой угол у основания — главный признак высоты ✅",
      },
    ],
  },
  t7_6: {
    title: "Признаки равенства треугольников",
    theory: `📖 **Три признака равенства треугольников:**

🔹 **1-й признак (СУС)** — по двум сторонам и углу между ними:
Если AB = DE, ∠B = ∠E, BC = EF → △ABC = △DEF

🔹 **2-й признак (УСУ)** — по стороне и двум прилежащим углам:
Если ∠A = ∠D, AC = DF, ∠C = ∠F → △ABC = △DEF

🔹 **3-й признак (ССС)** — по трём сторонам:
Если AB = DE, BC = EF, AC = DF → △ABC = △DEF

💡 **Мнемоника:** СУС → УСУ → ССС`,
    questions: [
      { id:"q1", type:"select_option", prompt:"Даны: AB = DE, ∠B = ∠E, BC = EF.\nКакой это признак равенства?",
        options:[{id:"opt1",label:"1-й (СУС)",description:"Две стороны и угол между ними"},{id:"opt2",label:"2-й (УСУ)",description:"Сторона и два прилежащих угла"},{id:"opt3",label:"3-й (ССС)",description:"По трём сторонам"}],
        correct:"opt1", explanation:"Верно! Две стороны (AB=DE, BC=EF) и угол между ними (∠B=∠E) — это 1-й признак (СУС)! ✅" },
      { id:"q2", type:"select_option", prompt:"Даны: ∠A = ∠D, AB = DE, ∠B = ∠E.\nКакой это признак?",
        options:[{id:"opt1",label:"1-й (СУС)",description:"Две стороны и угол между ними"},{id:"opt2",label:"2-й (УСУ)",description:"Сторона и два прилежащих угла"},{id:"opt3",label:"3-й (ССС)",description:"По трём сторонам"}],
        correct:"opt2", explanation:"Два угла (∠A=∠D, ∠B=∠E) и сторона между ними (AB=DE) — это 2-й признак (УСУ)! ✅" },
      { id:"q3", type:"select_option", prompt:"Даны: AB = DE, AC = DF, BC = EF.\nКакой это признак?",
        options:[{id:"opt1",label:"1-й (СУС)",description:"Две стороны и угол между ними"},{id:"opt2",label:"2-й (УСУ)",description:"Сторона и два прилежащих угла"},{id:"opt3",label:"3-й (ССС)",description:"По трём сторонам"}],
        correct:"opt3", explanation:"Все три стороны равны — это 3-й признак (ССС)! ✅" },
    ],
  },
};

// ============ THEMED PARTICLES ============
const GRADE_THEMES = {
  7: { shapes: ["△","▲","∠","⊿"], labels: ["A","B","C"], color: "rgba(79,140,255,0.08)" },
  8: { shapes: ["□","◇","▱","⬡","⏢"], labels: ["S","a","b","h"], color: "rgba(255,107,157,0.08)" },
  9: { shapes: ["→","○","⊙","∠","↗"], labels: ["x⃗","y⃗","r","φ"], color: "rgba(255,215,0,0.08)" },
  1011: { shapes: ["△","□","⊥","∥","⬡","◯"], labels: ["α","β","V","S"], color: "rgba(74,222,128,0.08)" },
  welcome: { shapes: ["△","□","○","◇","∠","⬡","⊿","▱"], labels: ["A","B","C","∠","π","⊥"], color: "rgba(255,255,255,0.06)" },
};

function ThemedParticles({ theme = "welcome", accentColor }) {
  const t = GRADE_THEMES[theme] || GRADE_THEMES.welcome;
  const allItems = [...t.shapes, ...t.shapes, ...t.labels];

  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      content: allItems[i % allItems.length],
      left: Math.random() * 100,
      delay: Math.random() * 14,
      duration: 12 + Math.random() * 16,
      size: 8 + Math.random() * 18,
      isLabel: i >= t.shapes.length * 2,
      drift: (Math.random() - 0.5) * 60,
    }));
  }, [theme]);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {particles.map((p, i) => (
        <div key={`${theme}-${i}`} style={{
          position: "absolute",
          left: `${p.left}%`,
          bottom: "-40px",
          fontSize: p.isLabel ? `${p.size * 0.7}px` : `${p.size}px`,
          color: accentColor ? `${accentColor}15` : t.color,
          fontFamily: p.isLabel ? "Comfortaa, serif" : "inherit",
          fontWeight: p.isLabel ? 700 : 400,
          animation: `floatParticle${i % 3} ${p.duration}s ${p.delay}s infinite ease-out`,
          opacity: 0,
          willChange: "transform, opacity",
        }}>
          {p.content}
        </div>
      ))}
      <style>{`
        @keyframes floatParticle0 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.5; }
          85% { opacity: 0.12; }
          100% { transform: translateY(-105vh) translateX(30px) rotate(180deg); opacity: 0; }
        }
        @keyframes floatParticle1 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.4; }
          85% { opacity: 0.1; }
          100% { transform: translateY(-105vh) translateX(-40px) rotate(-120deg); opacity: 0; }
        }
        @keyframes floatParticle2 {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.45; }
          85% { opacity: 0.08; }
          100% { transform: translateY(-105vh) translateX(20px) rotate(240deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ============ HERO GRAPHIC (Welcome screen) ============
function HeroGraphic() {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 2;
    const W = 320, H = 260;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);

    const shapes = [
      { type: "tri", cx: 160, cy: 115, r: 65, rot: 0, speed: 0.003, color: "rgba(102,126,234,0.35)", lineW: 2 },
      { type: "tri", cx: 100, cy: 155, r: 40, rot: 2, speed: -0.005, color: "rgba(255,107,157,0.25)", lineW: 1.5 },
      { type: "circle", cx: 215, cy: 90, r: 30, speed: 0.004, color: "rgba(255,215,0,0.2)", lineW: 1.5 },
      { type: "square", cx: 230, cy: 175, r: 28, rot: 0.5, speed: 0.004, color: "rgba(74,222,128,0.2)", lineW: 1.5 },
      { type: "tri", cx: 80, cy: 85, r: 25, rot: 1, speed: 0.007, color: "rgba(255,165,0,0.18)", lineW: 1 },
      { type: "hex", cx: 160, cy: 200, r: 22, rot: 0, speed: -0.003, color: "rgba(138,128,255,0.2)", lineW: 1.5 },
    ];

    const drawShape = (s, time) => {
      const rot = s.rot + time * s.speed;
      ctx.save();
      ctx.translate(s.cx, s.cy);
      ctx.rotate(rot);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.lineW;
      ctx.beginPath();

      if (s.type === "tri") {
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
          const method = i === 0 ? "moveTo" : "lineTo";
          ctx[method](Math.cos(a) * s.r, Math.sin(a) * s.r);
        }
        ctx.closePath();
      } else if (s.type === "circle") {
        ctx.arc(0, 0, s.r, 0, Math.PI * 2);
      } else if (s.type === "square") {
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
          const method = i === 0 ? "moveTo" : "lineTo";
          ctx[method](Math.cos(a) * s.r, Math.sin(a) * s.r);
        }
        ctx.closePath();
      } else if (s.type === "hex") {
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          const method = i === 0 ? "moveTo" : "lineTo";
          ctx[method](Math.cos(a) * s.r, Math.sin(a) * s.r);
        }
        ctx.closePath();
      }
      ctx.stroke();
      ctx.restore();
    };

    // Points floating
    const points = Array.from({ length: 8 }).map(() => ({
      x: 40 + Math.random() * 240,
      y: 30 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 2 + Math.random() * 2,
    }));

    const animate = () => {
      frameRef.current++;
      const t = frameRef.current;
      ctx.clearRect(0, 0, W, H);

      // Draw shapes
      shapes.forEach(s => drawShape(s, t));

      // Draw floating points
      points.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 20 || p.x > 300) p.vx *= -1;
        if (p.y < 20 || p.y > 240) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.sin(t * 0.02 + p.x) * 0.08})`;
        ctx.fill();
      });

      // Draw connections between close points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.05 * (1 - d / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Labels floating near shapes
      const labels = [
        { text: "A", x: 125 + Math.sin(t * 0.01) * 3, y: 62, c: "rgba(102,126,234,0.4)" },
        { text: "B", x: 200 + Math.cos(t * 0.012) * 3, y: 165, c: "rgba(102,126,234,0.35)" },
        { text: "C", x: 96 + Math.sin(t * 0.015) * 2, y: 180, c: "rgba(102,126,234,0.3)" },
        { text: "90°", x: 246, y: 152 + Math.sin(t * 0.01) * 2, c: "rgba(74,222,128,0.3)" },
        { text: "∠α", x: 70, y: 112 + Math.cos(t * 0.008) * 2, c: "rgba(255,165,0,0.3)" },
      ];
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      labels.forEach(l => {
        ctx.font = "bold 13px Comfortaa, sans-serif";
        ctx.fillStyle = l.c;
        ctx.fillText(l.text, l.x, l.y);
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  return <canvas ref={canvasRef} style={{ width: 320, height: 260, display: "block", margin: "0 auto" }} />;
}


// ============ CANVAS FOR EXERCISES ============
function TriangleCanvas({ question, selectedLine, result, confirmed }) {
  const canvasRef = useRef(null);
  const tri = question.triangle;
  const lines = question.getLinesFromTriangle ? question.getLinesFromTriangle(tri) : [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 2;
    const W = 340, H = 330;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Fill
    ctx.beginPath();
    ctx.moveTo(tri.A.x, tri.A.y); ctx.lineTo(tri.B.x, tri.B.y); ctx.lineTo(tri.C.x, tri.C.y);
    ctx.closePath(); ctx.fillStyle = "rgba(255,255,255,0.03)"; ctx.fill();

    // Sides
    ctx.beginPath();
    ctx.moveTo(tri.A.x, tri.A.y); ctx.lineTo(tri.B.x, tri.B.y); ctx.lineTo(tri.C.x, tri.C.y);
    ctx.closePath(); ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2.5; ctx.stroke();

    // Dashed helper lines
    lines.forEach(line => {
      const from = tri[line.vertex], to = line.toPoint;
      ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "rgba(255,255,255,0.13)"; ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(to.x, to.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fill();
    });

    // Selected line
    if (selectedLine) {
      const sel = lines.find(l => l.id === selectedLine);
      if (sel) {
        const from = tri[sel.vertex], to = sel.toPoint;
        const isC = confirmed && result === "correct", isW = confirmed && result === "wrong";
        const color = isC ? "#4ADE80" : isW ? "#FF6B6B" : "#60A5FA";

        ctx.save(); ctx.shadowColor = color; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color; ctx.lineWidth = 3.5; ctx.stroke(); ctx.restore();
        ctx.beginPath(); ctx.arc(to.x, to.y, 5, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();

        // Hints on correct answer
        if (isC) {
          const sideP1 = tri[sel.side[0]], sideP2 = tri[sel.side[1]];

          if (sel.type === "height") {
            const fp = to;
            const sd = { x: sideP2.x - sideP1.x, y: sideP2.y - sideP1.y };
            const sL = Math.hypot(sd.x, sd.y);
            const su = { x: sd.x / sL, y: sd.y / sL };
            const pu = { x: -su.y, y: su.x };
            const sz = 14;
            const tv = { x: from.x - fp.x, y: from.y - fp.y };
            const sign = (tv.x * pu.x + tv.y * pu.y) > 0 ? 1 : -1;
            const c1 = { x: fp.x + su.x * sz, y: fp.y + su.y * sz };
            const c2 = { x: c1.x + pu.x * sz * sign, y: c1.y + pu.y * sz * sign };
            const c3 = { x: fp.x + pu.x * sz * sign, y: fp.y + pu.y * sz * sign };
            ctx.beginPath(); ctx.moveTo(c1.x, c1.y); ctx.lineTo(c2.x, c2.y); ctx.lineTo(c3.x, c3.y);
            ctx.strokeStyle = "#4ADE80"; ctx.lineWidth = 2; ctx.stroke();
            ctx.font = "bold 11px Nunito"; ctx.fillStyle = "#4ADE80"; ctx.textAlign = "center";
            ctx.fillText("90°", c2.x + pu.x * 10 * sign, c2.y + pu.y * 10 * sign + 4);
          }

          if (sel.type === "median") {
            const mid = to;
            const drawTick = (p1, p2, count) => {
              const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
              const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy);
              const nx = -dy / len, ny = dx / len;
              for (let i = 0; i < count; i++) {
                const off = (i - (count - 1) / 2) * 6;
                const cx = mx + (dx / len) * off, cy = my + (dy / len) * off;
                ctx.beginPath();
                ctx.moveTo(cx - nx * 8, cy - ny * 8); ctx.lineTo(cx + nx * 8, cy + ny * 8);
                ctx.strokeStyle = "#4ADE80"; ctx.lineWidth = 2; ctx.stroke();
              }
            };
            drawTick(sideP1, mid, 1); drawTick(mid, sideP2, 1);
          }

          if (sel.type === "bisector") {
            const vertex = from;
            const a1 = angleOf(vertex.x, vertex.y, sideP1.x, sideP1.y);
            const a2 = angleOf(vertex.x, vertex.y, sideP2.x, sideP2.y);
            const ab = angleOf(vertex.x, vertex.y, to.x, to.y);
            const drawArc = (sa, ea, r) => {
              let d = ea - sa; if (d > Math.PI) ea -= 2 * Math.PI; if (d < -Math.PI) ea += 2 * Math.PI;
              ctx.beginPath(); ctx.arc(vertex.x, vertex.y, r, sa, ea, ea < sa);
              ctx.strokeStyle = "#4ADE80"; ctx.lineWidth = 2; ctx.stroke();
            };
            const drawTick = (sa, ea, r) => {
              let d = ea - sa; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI;
              const mid = sa + d / 2;
              const tx = vertex.x + Math.cos(mid) * r, ty = vertex.y + Math.sin(mid) * r;
              ctx.beginPath();
              ctx.moveTo(tx - Math.cos(mid) * 5, ty - Math.sin(mid) * 5);
              ctx.lineTo(tx + Math.cos(mid) * 5, ty + Math.sin(mid) * 5);
              ctx.strokeStyle = "#4ADE80"; ctx.lineWidth = 2; ctx.stroke();
            };
            drawArc(a1, ab, 28); drawArc(ab, a2, 28);
            drawTick(a1, ab, 28); drawTick(ab, a2, 28);
          }
        }

        // Show correct on wrong
        if (isW) {
          const cl = lines.find(l => l.id === question.correct);
          if (cl) {
            const cf = tri[cl.vertex], ct = cl.toPoint;
            ctx.beginPath(); ctx.moveTo(cf.x, cf.y); ctx.lineTo(ct.x, ct.y);
            ctx.strokeStyle = "rgba(74,222,128,0.5)"; ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]);
            ctx.beginPath(); ctx.arc(ct.x, ct.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(74,222,128,0.5)"; ctx.fill();
            ctx.font = "bold 12px Nunito"; ctx.fillStyle = "rgba(74,222,128,0.7)";
            ctx.textAlign = "center"; ctx.fillText("✓ " + cl.label, ct.x, ct.y + 18);
          }
        }
      }
    }

    // Vertex labels
    ["A", "B", "C"].forEach(name => {
      const pos = tri[name];
      const cx = (tri.A.x + tri.B.x + tri.C.x) / 3, cy = (tri.A.y + tri.B.y + tri.C.y) / 3;
      const dx = pos.x - cx, dy = pos.y - cy, d = Math.hypot(dx, dy);
      const lx = pos.x + (dx / d) * 20, ly = pos.y + (dy / d) * 20 + 5;
      ctx.font = "bold 18px Nunito"; ctx.fillStyle = "#fff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(name, lx, ly);
    });

    // Endpoint labels
    lines.forEach(line => {
      const to = line.toPoint, from = tri[line.vertex];
      const short = line.label.slice(1);
      const isSel = selectedLine === line.id;
      const isCorr = confirmed && line.id === question.correct;
      const col = isSel ? (confirmed ? (result === "correct" ? "#4ADE80" : "#FF6B6B") : "#60A5FA")
        : isCorr && confirmed ? "rgba(74,222,128,0.6)" : "rgba(255,255,255,0.3)";
      const px = -(to.y - from.y), py = to.x - from.x;
      const pL = Math.hypot(px, py);
      ctx.font = "bold 13px Nunito"; ctx.fillStyle = col;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(short, to.x + (px / pL) * 14, to.y + (py / pL) * 14);
    });

  }, [question, selectedLine, result, confirmed]);

  return <canvas ref={canvasRef} style={{ width: 340, height: 330, display: "block", margin: "0 auto" }} />;
}


// ============ UI HELPERS ============
function XPBar({ xp, level }) {
  const progress = (xp % 100) / 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 16px" }}>
      <div style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", borderRadius: 12, padding: "2px 10px", fontWeight: 800, fontSize: 13, color: "#5a3600", fontFamily: "Nunito" }}>Ур.{level}</div>
      <div style={{ flex: 1, height: 10, background: "rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress * 100}%`, background: "linear-gradient(90deg, #FFD700, #FF8C00)", borderRadius: 10, transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, fontFamily: "Nunito" }}>{xp % 100}/100</span>
    </div>
  );
}

function StreakBadge({ streak }) {
  if (streak < 2) return null;
  return <div style={{ position: "absolute", top: 12, right: 16, background: streak >= 5 ? "linear-gradient(135deg,#FF4500,#FF6347)" : "linear-gradient(135deg,#FF8C00,#FFD700)", borderRadius: 20, padding: "4px 14px", fontWeight: 800, fontSize: 13, color: "#fff", fontFamily: "Nunito", animation: "popIn 0.3s ease-out" }}>🔥 {streak} подряд!</div>;
}


// ============ SCREENS ============
function WelcomeScreen({ onStart }) {
  const [v, setV] = useState(false);
  useEffect(() => { setTimeout(() => setV(true), 100); }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 24px", textAlign: "center", opacity: v ? 1 : 0, transform: v ? "none" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.4,0,0.2,1)" }}>
      <HeroGraphic />
      <h1 style={{ fontFamily: "Comfortaa", fontSize: 38, fontWeight: 700, color: "#fff", marginBottom: 6, marginTop: -8, letterSpacing: -1, background: "linear-gradient(135deg, #667eea, #a78bfa, #FF6B9D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        ГеоЛаб
      </h1>
      <p style={{ fontFamily: "Nunito", fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 10, maxWidth: 300, lineHeight: 1.5 }}>
        Интерактивная геометрия для школьников
      </p>
      <div style={{ display: "flex", gap: 16, marginBottom: 28, justifyContent: "center" }}>
        {[{icon:"🧠",label:"Научный метод"},{icon:"🎮",label:"Интерактив"},{icon:"📈",label:"Прогресс"}].map((b,i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, animation: `fadeIn 0.5s ${0.3 + i * 0.15}s both ease-out` }}>
            <div style={{ fontSize: 22 }}>{b.icon}</div>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{b.label}</div>
          </div>
        ))}
      </div>
      <button onClick={onStart} style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", border: "none", borderRadius: 16, padding: "16px 52px", color: "#fff", fontFamily: "Nunito", fontSize: 18, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 32px rgba(102,126,234,0.4)" }}>
        Начать →
      </button>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}

function CharacterScreen({ onSelect }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <h2 style={{ fontFamily: "Comfortaa", fontSize: 24, color: "#fff", marginBottom: 8, textAlign: "center" }}>Выбери наставника</h2>
      <p style={{ fontFamily: "Nunito", fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 32, textAlign: "center" }}>Твой помощник в мире геометрии</p>
      <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 360 }}>
        {Object.entries(CHARACTERS).map(([key, char], i) => (
          <button key={key} onClick={() => onSelect(key)} style={{ flex: 1, background: `linear-gradient(160deg, ${char.color}22, ${char.color}08)`, border: `2px solid ${char.color}44`, borderRadius: 20, padding: "24px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, cursor: "pointer", animation: `slideUp 0.5s ${i*0.15}s both ease-out` }}>
            <div style={{ fontSize: 56 }}>{char.emoji}</div>
            <div style={{ fontFamily: "Comfortaa", fontSize: 17, fontWeight: 700, color: "#fff" }}>{char.name}</div>
            <div style={{ fontFamily: "Nunito", fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.4, textAlign: "center" }}>
              {key === "male" ? "Древнегреческий гений, любит точные науки" : "Первая женщина-математик, мудрая и добрая"}
            </div>
          </button>
        ))}
      </div>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

function GradeScreen({ character, onSelect, onMethod }) {
  const char = CHARACTERS[character];
  return (
    <div style={{ minHeight: "100vh", padding: "20px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: 14, background: `linear-gradient(135deg, ${char.color}15, ${char.color}08)`, borderRadius: 16, border: `1px solid ${char.color}25` }}>
        <div style={{ fontSize: 36 }}>{char.emoji}</div>
        <div style={{ fontFamily: "Nunito", fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{char.greeting}</div>
      </div>
      <h2 style={{ fontFamily: "Comfortaa", fontSize: 22, color: "#fff", marginBottom: 6 }}>Выбери класс</h2>
      <p style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Темы школьной программы по геометрии</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {GRADES.map((grade, i) => (
          <button key={grade.id} onClick={() => onSelect(grade.id)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", animation: `slideUp 0.4s ${i*0.08}s both ease-out` }}>
            <div style={{ fontSize: 28, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: `${char.color}15`, borderRadius: 14, flexShrink: 0 }}>{grade.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "Comfortaa", fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{grade.label}</div>
              <div style={{ fontFamily: "Nunito", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{grade.description}</div>
            </div>
            <div style={{ fontFamily: "Nunito", fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 10 }}>{grade.topics} тем</div>
          </button>
        ))}
      </div>
      <button onClick={onMethod} style={{ width: "100%", marginTop: 18, padding: "14px", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }}>🧠</span>
        <div style={{ textAlign: "left" }}>
          <div style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 700, color: "#FFD700" }}>Как работает запоминание?</div>
          <div style={{ fontFamily: "Nunito", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Научный метод в основе приложения</div>
        </div>
      </button>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

function MethodScreen({ character, onBack }) {
  const char = CHARACTERS[character];
  const items = [
    { icon:"🔁", title:"Интервальное повторение", color:"#4F8CFF", text:"Материал через увеличивающиеся промежутки: 1 день → 3 дня → 7 дней → 14 дней. Метод Эббингауза — информация переходит в долговременную память." },
    { icon:"🧠", title:"Активное вспоминание", color:"#FF6B9D", text:"Вместо перечитывания теории — сразу задание. Мозг запоминает лучше, когда сам извлекает информацию." },
    { icon:"👁️", title:"Визуальное кодирование", color:"#FFD700", text:"Подсказки прямо на чертеже: дуги углов, прямые углы, чёрточки. Мозг запоминает образы в 6 раз лучше текста." },
    { icon:"🔥", title:"Серии и мотивация", color:"#FF8C00", text:"Серии ответов активируют дофамин. XP и уровни создают ощущение прогресса. Игровые элементы повышают мотивацию на 48%." },
    { icon:"🎯", title:"Мнемоники", color:"#4ADE80", text:"«Крыса-биссектриса делит угол пополам», «СУС-УСУ-ССС» — яркие образы удерживаются в памяти дольше." },
  ];
  return (
    <div style={{ minHeight: "100vh", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
        <h3 style={{ fontFamily: "Comfortaa", fontSize: 18, color: "#fff", margin: 0 }}>Как мы помогаем запоминать</h3>
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", marginBottom: 10, border: `1px solid ${item.color}20`, animation: `slideIn 0.3s ${i*0.06}s both ease-out` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ fontFamily: "Comfortaa", fontSize: 15, fontWeight: 700, color: item.color }}>{item.title}</span>
          </div>
          <div style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 }}>{item.text}</div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 10, marginTop: 12, padding: "14px", background: `${char.color}10`, borderRadius: 14, border: `1px solid ${char.color}20`, alignItems: "center" }}>
        <span style={{ fontSize: 28 }}>{char.emoji}</span>
        <span style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>Просто решай задания — остальное мы берём на себя!</span>
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(-15px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

function TopicsScreen({ character, grade, onSelect, onBack }) {
  const topics = TOPICS_BY_GRADE[grade] || [];
  const char = CHARACTERS[character];
  return (
    <div style={{ minHeight: "100vh", padding: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Comfortaa", fontSize: 20, color: "#fff", margin: 0 }}>{grade === 1011 ? "10–11 класс" : `${grade} класс`}</h2>
          <p style={{ fontFamily: "Nunito", fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Выбери тему</p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {topics.map((topic, i) => {
          const hasEx = !!EXERCISES[topic.id];
          return (
            <button key={topic.id} onClick={() => hasEx && onSelect(topic.id)} style={{ background: hasEx ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)", border: hasEx ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "13px 15px", display: "flex", alignItems: "center", gap: 12, cursor: hasEx ? "pointer" : "default", textAlign: "left", opacity: hasEx ? 1 : 0.45, animation: `slideIn 0.3s ${i*0.03}s both ease-out` }}>
              <span style={{ fontSize: 20, width: 32, textAlign: "center" }}>{topic.icon}</span>
              <span style={{ fontFamily: "Nunito", fontSize: 14, fontWeight: 600, color: "#fff", flex: 1 }}>{topic.title}</span>
              {hasEx ? <span style={{ fontSize: 11, color: char.color, background: `${char.color}15`, padding: "3px 10px", borderRadius: 8, fontFamily: "Nunito", fontWeight: 700 }}>Играть</span>
                : <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "Nunito" }}>🔒 Скоро</span>}
            </button>
          );
        })}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(-15px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

function ExerciseScreen({ character, topicId, xp, setXp, level, setLevel, onBack }) {
  const exercise = EXERCISES[topicId];
  const char = CHARACTERS[character];
  const [showTheory, setShowTheory] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedLine, setSelectedLine] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState("");
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = exercise.questions[currentQ];

  const handleSelect = (id) => { if (!confirmed) setSelectedLine(id); };
  const handleConfirm = () => {
    if (!selectedLine || confirmed) return;
    setConfirmed(true);
    const isCorrect = selectedLine === question.correct;
    setResult(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      const ns = streak + 1; setStreak(ns); setTotalCorrect(p => p + 1);
      const bonus = 10 + (ns >= 3 ? 5 : 0); const nxp = xp + bonus; setXp(nxp);
      if (Math.floor(nxp / 100) > Math.floor(xp / 100)) setLevel(l => l + 1);
      setMessage(char.encouragement[Math.floor(Math.random() * char.encouragement.length)] + ` +${bonus} XP`);
    } else { setStreak(0); setMessage(char.wrong[Math.floor(Math.random() * char.wrong.length)]); }
  };
  const handleNext = () => {
    if (currentQ < exercise.questions.length - 1) { setCurrentQ(q=>q+1); setSelectedLine(null); setConfirmed(false); setResult(null); setMessage(""); }
    else setFinished(true);
  };
  const handleRetry = () => { setCurrentQ(0); setSelectedLine(null); setConfirmed(false); setResult(null); setStreak(0); setMessage(""); setTotalCorrect(0); setFinished(false); };

  // Finished
  if (finished) {
    const score = Math.round((totalCorrect / exercise.questions.length) * 100);
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16, animation: "popIn 0.5s" }}>{score >= 80 ? "🏆" : score >= 50 ? "⭐" : "💪"}</div>
        <h2 style={{ fontFamily: "Comfortaa", fontSize: 26, color: "#fff", marginBottom: 8 }}>{score >= 80 ? "Превосходно!" : score >= 50 ? "Хорошая работа!" : "Не сдавайся!"}</h2>
        <p style={{ fontFamily: "Nunito", fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>Правильных: {totalCorrect} из {exercise.questions.length}</p>
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[{l:"Точность",v:`${score}%`,c:"#4ADE80"},{l:"XP",v:`+${totalCorrect*10}`,c:"#FFD700"}].map(s=>(
            <div key={s.l} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 24px", textAlign: "center" }}>
              <div style={{ fontFamily: "Comfortaa", fontSize: 24, fontWeight: 800, color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: "Nunito", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${char.color}12`, borderRadius: 14, padding: "12px 16px", marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>{char.emoji}</span>
          <span style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{score >= 80 ? char.encouragement[0] : "Повтори теорию и попробуй ещё!"}</span>
        </div>
        {score < 100 && <div style={{ background: "rgba(255,215,0,0.06)", borderRadius: 12, padding: "10px 14px", marginBottom: 20, border: "1px solid rgba(255,215,0,0.15)" }}>
          <div style={{ fontFamily: "Nunito", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>🧠 Мы напомним об этой теме через 1 день (интервальное повторение)</div>
        </div>}
        <div style={{ display: "flex", gap: 10, width: "100%" }}>
          <button onClick={onBack} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: "14px", color: "#fff", fontFamily: "Nunito", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>К темам</button>
          <button onClick={handleRetry} style={{ flex: 1, background: `linear-gradient(135deg, ${char.color}, ${char.color}cc)`, border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontFamily: "Nunito", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 20px ${char.color}40` }}>Ещё раз 🔄</button>
        </div>
        <style>{`@keyframes popIn { from { transform:scale(0); } to { transform:scale(1); } }`}</style>
      </div>
    );
  }

  // Theory
  if (showTheory) {
    return (
      <div style={{ minHeight: "100vh", padding: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#fff" }}>←</button>
          <h3 style={{ fontFamily: "Comfortaa", fontSize: 17, color: "#fff", margin: 0 }}>{exercise.title}</h3>
        </div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "18px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontFamily: "Nunito", fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {exercise.theory.split(/(\*\*.*?\*\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i} style={{ color: char.color }}>{part.slice(2, -2)}</strong> : part)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, background: `${char.color}10`, borderRadius: 14, padding: "12px 14px", marginBottom: 18, border: `1px solid ${char.color}20` }}>
          <span style={{ fontSize: 28 }}>{char.emoji}</span>
          <span style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.4 }}>Прочитай внимательно — в заданиях подсказки прямо на чертеже! 🧠</span>
        </div>
        <button onClick={() => setShowTheory(false)} style={{ width: "100%", background: `linear-gradient(135deg, ${char.color}, ${char.color}cc)`, border: "none", borderRadius: 16, padding: "16px", color: "#fff", fontFamily: "Nunito", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 24px ${char.color}35` }}>Перейти к заданиям →</button>
      </div>
    );
  }

  // Questions
  const items = question.type === "select_line" ? (question.getLinesFromTriangle ? question.getLinesFromTriangle(question.triangle) : []) : question.options;
  return (
    <div style={{ minHeight: "100vh", padding: "12px 16px", position: "relative" }}>
      <StreakBadge streak={streak} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <button onClick={() => setShowTheory(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "#fff" }}>📖</button>
        <div style={{ flex: 1, fontFamily: "Comfortaa", fontSize: 14, color: "#fff", fontWeight: 700 }}>Задание {currentQ + 1} / {exercise.questions.length}</div>
      </div>
      <XPBar xp={xp} level={level} />
      <div style={{ display: "flex", gap: 4, justifyContent: "center", marginBottom: 10 }}>
        {exercise.questions.map((_, i) => <div key={i} style={{ width: i === currentQ ? 24 : 8, height: 8, borderRadius: 4, background: i < currentQ ? "#4ADE80" : i === currentQ ? char.color : "rgba(255,255,255,0.12)", transition: "all 0.3s" }} />)}
      </div>
      <div style={{ fontFamily: "Nunito", fontSize: 15, fontWeight: 600, color: "#fff", textAlign: "center", marginBottom: 6, lineHeight: 1.4 }}>{question.prompt}</div>

      {question.type === "select_line" && (
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 20, padding: "4px 0", marginBottom: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
          <TriangleCanvas question={question} selectedLine={selectedLine} result={result} confirmed={confirmed} />
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 10 }}>
        {items.map(item => {
          const isSel = selectedLine === item.id;
          const isCorr = confirmed && item.id === question.correct;
          const isWr = confirmed && result === "wrong" && isSel;
          return (
            <button key={item.id} onClick={() => handleSelect(item.id)} disabled={confirmed} style={{
              background: isCorr ? "rgba(74,222,128,0.12)" : isWr ? "rgba(255,107,107,0.12)" : isSel && !confirmed ? `${char.color}18` : "rgba(255,255,255,0.04)",
              border: isCorr ? "2px solid #4ADE80" : isWr ? "2px solid #FF6B6B" : isSel && !confirmed ? `2px solid ${char.color}88` : "2px solid rgba(255,255,255,0.06)",
              borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 12, cursor: confirmed ? "default" : "pointer", textAlign: "left", transition: "all 0.2s",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: isCorr ? "rgba(74,222,128,0.2)" : isWr ? "rgba(255,107,107,0.2)" : `${char.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Comfortaa", fontSize: 13, fontWeight: 800, flexShrink: 0, color: isCorr ? "#4ADE80" : isWr ? "#FF6B6B" : isSel ? char.color : "rgba(255,255,255,0.5)" }}>
                {isCorr ? "✓" : isWr ? "✗" : item.label.slice(0, 2)}
              </div>
              <div>
                <div style={{ fontFamily: "Nunito", fontSize: 15, fontWeight: 700, color: isCorr ? "#4ADE80" : isWr ? "#FF6B6B" : "#fff" }}>{item.label}</div>
                <div style={{ fontFamily: "Nunito", fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{item.description}</div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedLine && !confirmed && (
        <button onClick={handleConfirm} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${char.color}, ${char.color}cc)`, border: "none", borderRadius: 14, color: "#fff", fontFamily: "Nunito", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 20px ${char.color}35`, animation: "slideUp 0.25s ease-out", marginBottom: 10 }}>
          Проверить ✓
        </button>
      )}

      {confirmed && (
        <div style={{ animation: "slideUp 0.3s ease-out" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: result === "correct" ? "rgba(74,222,128,0.06)" : "rgba(255,107,107,0.06)", borderRadius: 16, padding: "12px 14px", border: `1px solid ${result === "correct" ? "rgba(74,222,128,0.15)" : "rgba(255,107,107,0.15)"}`, marginBottom: 10 }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{char.emoji}</span>
            <div style={{ fontFamily: "Nunito", fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
              <div style={{ fontWeight: 700, marginBottom: 4, color: result === "correct" ? "#4ADE80" : "#FF6B6B" }}>{message}</div>
              {question.explanation}
            </div>
          </div>
          {question.type === "select_line" && result === "correct" && (
            <div style={{ background: "rgba(74,222,128,0.05)", borderRadius: 12, padding: "10px 14px", marginBottom: 10, border: "1px solid rgba(74,222,128,0.1)" }}>
              <div style={{ fontFamily: "Nunito", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
                {question.hintType === "median" && "📏 Чёрточки = равные отрезки (AM = MC)"}
                {question.hintType === "height" && "📐 Квадратик = прямой угол (90°)"}
                {question.hintType === "bisector" && "🔵 Дуги = два равных угла"}
              </div>
            </div>
          )}
          <button onClick={handleNext} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${char.color}, ${char.color}cc)`, border: "none", borderRadius: 14, color: "#fff", fontFamily: "Nunito", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 20px ${char.color}35` }}>
            {currentQ < exercise.questions.length - 1 ? "Далее →" : "Завершить 🏆"}
          </button>
        </div>
      )}
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(15px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { transform:scale(0.5); opacity:0; } to { transform:scale(1); opacity:1; } }
      `}</style>
    </div>
  );
}


// ============ MAIN APP ============
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [character, setCharacter] = useState(null);
  const [grade, setGrade] = useState(null);
  const [topic, setTopic] = useState(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  // Determine particle theme
  const particleTheme = screen === "welcome" || screen === "character" ? "welcome"
    : screen === "topics" || screen === "exercise" ? (grade || "welcome")
    : "welcome";

  const accentColor = character ? CHARACTERS[character].color : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(165deg, #0f0c29 0%, #1a1333 30%, #24243e 70%, #0f0c29 100%)", color: "#fff", maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden", fontFamily: "Nunito, sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <ThemedParticles theme={particleTheme} accentColor={accentColor} />
      <div style={{ position: "relative", zIndex: 1 }}>
        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("character")} />}
        {screen === "character" && <CharacterScreen onSelect={c => { setCharacter(c); setScreen("grade"); }} />}
        {screen === "grade" && <GradeScreen character={character} onSelect={g => { setGrade(g); setScreen("topics"); }} onMethod={() => setScreen("method")} />}
        {screen === "method" && <MethodScreen character={character} onBack={() => setScreen("grade")} />}
        {screen === "topics" && <TopicsScreen character={character} grade={grade} onSelect={t => { setTopic(t); setScreen("exercise"); }} onBack={() => setScreen("grade")} />}
        {screen === "exercise" && <ExerciseScreen character={character} topicId={topic} xp={xp} setXp={setXp} level={level} setLevel={setLevel} onBack={() => setScreen("topics")} />}
      </div>
    </div>
  );
}
