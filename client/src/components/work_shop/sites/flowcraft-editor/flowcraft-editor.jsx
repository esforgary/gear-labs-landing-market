import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlignCenter,
  Circle,
  Copy,
  Diamond,
  Download,
  FileText,
  Grid3X3,
  Minus,
  MousePointer2,
  Plus,
  Redo2,
  Save,
  Share2,
  SquareRoundCorner,
  Trash2,
  Undo2,
  Waypoints,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import "./flowcraft-editor.scss";

const copy = {
  ru: {
    brand: "FlowCraft",
    file: "Файл",
    home: "Главная",
    insert: "Вставка",
    design: "Дизайн",
    view: "Вид",
    title: "Редактор схем",
    subtitle: "Холст с фигурами, связями и базовыми инструментами как в Visio.",
    select: "Курсор",
    connector: "Связь",
    undo: "Назад",
    redo: "Вперед",
    save: "Сохранить",
    export: "Экспорт",
    share: "Доступ",
    palette: "Фигуры",
    dragHint: "Перетащите фигуру на холст или нажмите на нее",
    properties: "Свойства",
    selected: "Выбранный блок",
    noSelection: "Выберите фигуру на холсте",
    blockText: "Текст блока",
    color: "Цвет",
    zoom: "Масштаб",
    pages: "Страницы",
    pageOne: "Основная схема",
    pageTwo: "Процесс оплаты",
    pageThree: "Карта продукта",
    connectHint: "Выберите два блока, чтобы провести связь",
    canvasEmpty: "Добавьте фигуру из панели слева",
    process: "Процесс",
    decision: "Решение",
    data: "Данные",
    document: "Документ",
    start: "Старт",
    delete: "Удалить",
    duplicate: "Копия",
    templates: "Шаблоны",
    templateA: "Маршрут клиента",
    templateB: "Блок-схема",
    templateC: "Оргструктура",
    nodeStart: "Заявка",
    nodeTask: "Проверка",
    nodeDecision: "Решение",
    nodeFinish: "Запуск",
  },
  en: {
    brand: "FlowCraft",
    file: "File",
    home: "Home",
    insert: "Insert",
    design: "Design",
    view: "View",
    title: "Diagram editor",
    subtitle: "Canvas with shapes, connectors, and core Visio-style tools.",
    select: "Pointer",
    connector: "Connector",
    undo: "Undo",
    redo: "Redo",
    save: "Save",
    export: "Export",
    share: "Share",
    palette: "Shapes",
    dragHint: "Drag a shape to the canvas or click it",
    properties: "Properties",
    selected: "Selected block",
    noSelection: "Select a shape on the canvas",
    blockText: "Block text",
    color: "Color",
    zoom: "Zoom",
    pages: "Pages",
    pageOne: "Main diagram",
    pageTwo: "Payment flow",
    pageThree: "Product map",
    connectHint: "Pick two blocks to draw a connector",
    canvasEmpty: "Add a shape from the left panel",
    process: "Process",
    decision: "Decision",
    data: "Data",
    document: "Document",
    start: "Start",
    delete: "Delete",
    duplicate: "Duplicate",
    templates: "Templates",
    templateA: "Customer path",
    templateB: "Flowchart",
    templateC: "Org chart",
    nodeStart: "Request",
    nodeTask: "Review",
    nodeDecision: "Decision",
    nodeFinish: "Launch",
  },
  de: {
    brand: "FlowCraft",
    file: "Datei",
    home: "Start",
    insert: "Einfügen",
    design: "Design",
    view: "Ansicht",
    title: "Diagramm-Editor",
    subtitle: "Canvas mit Formen, Verbindungen und Visio-ähnlichen Werkzeugen.",
    select: "Zeiger",
    connector: "Verbindung",
    undo: "Zurück",
    redo: "Wiederholen",
    save: "Speichern",
    export: "Export",
    share: "Teilen",
    palette: "Formen",
    dragHint: "Form auf das Canvas ziehen oder anklicken",
    properties: "Eigenschaften",
    selected: "Ausgewählter Block",
    noSelection: "Wählen Sie eine Form",
    blockText: "Blocktext",
    color: "Farbe",
    zoom: "Zoom",
    pages: "Seiten",
    pageOne: "Hauptdiagramm",
    pageTwo: "Zahlungsprozess",
    pageThree: "Produktkarte",
    connectHint: "Zwei Blöcke wählen, um sie zu verbinden",
    canvasEmpty: "Fügen Sie links eine Form hinzu",
    process: "Prozess",
    decision: "Entscheidung",
    data: "Daten",
    document: "Dokument",
    start: "Start",
    delete: "Löschen",
    duplicate: "Kopie",
    templates: "Vorlagen",
    templateA: "Kundenpfad",
    templateB: "Flussdiagramm",
    templateC: "Organigramm",
    nodeStart: "Anfrage",
    nodeTask: "Prüfung",
    nodeDecision: "Entscheidung",
    nodeFinish: "Start",
  },
  fr: {
    brand: "FlowCraft",
    file: "Fichier",
    home: "Accueil",
    insert: "Insérer",
    design: "Design",
    view: "Vue",
    title: "Éditeur de schémas",
    subtitle: "Canvas avec formes, connecteurs et outils type Visio.",
    select: "Curseur",
    connector: "Lien",
    undo: "Annuler",
    redo: "Refaire",
    save: "Sauver",
    export: "Export",
    share: "Partager",
    palette: "Formes",
    dragHint: "Glissez une forme ou cliquez dessus",
    properties: "Propriétés",
    selected: "Bloc choisi",
    noSelection: "Choisissez une forme",
    blockText: "Texte du bloc",
    color: "Couleur",
    zoom: "Zoom",
    pages: "Pages",
    pageOne: "Schéma principal",
    pageTwo: "Paiement",
    pageThree: "Carte produit",
    connectHint: "Choisissez deux blocs pour les lier",
    canvasEmpty: "Ajoutez une forme depuis la gauche",
    process: "Processus",
    decision: "Décision",
    data: "Données",
    document: "Document",
    start: "Début",
    delete: "Supprimer",
    duplicate: "Copie",
    templates: "Modèles",
    templateA: "Parcours client",
    templateB: "Flowchart",
    templateC: "Organigramme",
    nodeStart: "Demande",
    nodeTask: "Vérifier",
    nodeDecision: "Décision",
    nodeFinish: "Lancer",
  },
  it: {
    brand: "FlowCraft",
    file: "File",
    home: "Home",
    insert: "Inserisci",
    design: "Design",
    view: "Vista",
    title: "Editor diagrammi",
    subtitle: "Canvas con forme, collegamenti e strumenti in stile Visio.",
    select: "Puntatore",
    connector: "Connessione",
    undo: "Annulla",
    redo: "Ripeti",
    save: "Salva",
    export: "Export",
    share: "Condividi",
    palette: "Forme",
    dragHint: "Trascina una forma o cliccala",
    properties: "Proprietà",
    selected: "Blocco scelto",
    noSelection: "Scegli una forma",
    blockText: "Testo blocco",
    color: "Colore",
    zoom: "Zoom",
    pages: "Pagine",
    pageOne: "Schema principale",
    pageTwo: "Pagamento",
    pageThree: "Mappa prodotto",
    connectHint: "Scegli due blocchi da collegare",
    canvasEmpty: "Aggiungi una forma da sinistra",
    process: "Processo",
    decision: "Decisione",
    data: "Dati",
    document: "Documento",
    start: "Start",
    delete: "Elimina",
    duplicate: "Copia",
    templates: "Template",
    templateA: "Percorso cliente",
    templateB: "Flowchart",
    templateC: "Organigramma",
    nodeStart: "Richiesta",
    nodeTask: "Revisione",
    nodeDecision: "Decisione",
    nodeFinish: "Lancio",
  },
  pl: {
    brand: "FlowCraft",
    file: "Plik",
    home: "Start",
    insert: "Wstaw",
    design: "Design",
    view: "Widok",
    title: "Edytor diagramów",
    subtitle: "Obszar z kształtami, łącznikami i narzędziami jak w Visio.",
    select: "Kursor",
    connector: "Łącznik",
    undo: "Cofnij",
    redo: "Ponów",
    save: "Zapisz",
    export: "Eksport",
    share: "Udostępnij",
    palette: "Kształty",
    dragHint: "Przeciągnij kształt albo kliknij",
    properties: "Właściwości",
    selected: "Wybrany blok",
    noSelection: "Wybierz kształt",
    blockText: "Tekst bloku",
    color: "Kolor",
    zoom: "Skala",
    pages: "Strony",
    pageOne: "Główny diagram",
    pageTwo: "Płatność",
    pageThree: "Mapa produktu",
    connectHint: "Wybierz dwa bloki, aby je połączyć",
    canvasEmpty: "Dodaj kształt z lewej",
    process: "Proces",
    decision: "Decyzja",
    data: "Dane",
    document: "Dokument",
    start: "Start",
    delete: "Usuń",
    duplicate: "Kopia",
    templates: "Szablony",
    templateA: "Ścieżka klienta",
    templateB: "Schemat",
    templateC: "Struktura",
    nodeStart: "Zgłoszenie",
    nodeTask: "Weryfikacja",
    nodeDecision: "Decyzja",
    nodeFinish: "Start",
  },
  cz: {
    brand: "FlowCraft",
    file: "Soubor",
    home: "Domů",
    insert: "Vložit",
    design: "Design",
    view: "Zobrazení",
    title: "Editor diagramů",
    subtitle: "Plátno s tvary, spojnicemi a nástroji ve stylu Visio.",
    select: "Kurzor",
    connector: "Spojnice",
    undo: "Zpět",
    redo: "Znovu",
    save: "Uložit",
    export: "Export",
    share: "Sdílet",
    palette: "Tvary",
    dragHint: "Přetáhněte tvar nebo klikněte",
    properties: "Vlastnosti",
    selected: "Vybraný blok",
    noSelection: "Vyberte tvar",
    blockText: "Text bloku",
    color: "Barva",
    zoom: "Měřítko",
    pages: "Stránky",
    pageOne: "Hlavní diagram",
    pageTwo: "Platba",
    pageThree: "Mapa produktu",
    connectHint: "Vyberte dva bloky pro spojení",
    canvasEmpty: "Přidejte tvar zleva",
    process: "Proces",
    decision: "Rozhodnutí",
    data: "Data",
    document: "Dokument",
    start: "Start",
    delete: "Smazat",
    duplicate: "Kopie",
    templates: "Šablony",
    templateA: "Cesta zákazníka",
    templateB: "Vývojový diagram",
    templateC: "Organigram",
    nodeStart: "Požadavek",
    nodeTask: "Kontrola",
    nodeDecision: "Rozhodnutí",
    nodeFinish: "Spuštění",
  },
  sk: {
    brand: "FlowCraft",
    file: "Súbor",
    home: "Domov",
    insert: "Vložiť",
    design: "Dizajn",
    view: "Zobraziť",
    title: "Editor diagramov",
    subtitle: "Plátno s tvarmi, spojnicami a nástrojmi ako vo Visio.",
    select: "Kurzor",
    connector: "Spojnica",
    undo: "Späť",
    redo: "Znova",
    save: "Uložiť",
    export: "Export",
    share: "Zdieľať",
    palette: "Tvary",
    dragHint: "Presuňte tvar alebo kliknite",
    properties: "Vlastnosti",
    selected: "Vybraný blok",
    noSelection: "Vyberte tvar",
    blockText: "Text bloku",
    color: "Farba",
    zoom: "Mierka",
    pages: "Stránky",
    pageOne: "Hlavný diagram",
    pageTwo: "Platba",
    pageThree: "Mapa produktu",
    connectHint: "Vyberte dva bloky pre spojenie",
    canvasEmpty: "Pridajte tvar zľava",
    process: "Proces",
    decision: "Rozhodnutie",
    data: "Dáta",
    document: "Dokument",
    start: "Štart",
    delete: "Vymazať",
    duplicate: "Kópia",
    templates: "Šablóny",
    templateA: "Cesta zákazníka",
    templateB: "Vývojový diagram",
    templateC: "Organigram",
    nodeStart: "Požiadavka",
    nodeTask: "Kontrola",
    nodeDecision: "Rozhodnutie",
    nodeFinish: "Spustenie",
  },
};

const CANVAS_WIDTH = 1160;
const CANVAS_HEIGHT = 720;

const shapeCatalog = [
  { type: "process", icon: SquareRoundCorner, color: "#3d8bff", width: 178, height: 74, key: "process" },
  { type: "decision", icon: Diamond, color: "#ff7a00", width: 140, height: 140, key: "decision" },
  { type: "data", icon: Circle, color: "#1fc58a", width: 150, height: 86, key: "data" },
  { type: "document", icon: FileText, color: "#8c5cf6", width: 170, height: 92, key: "document" },
  { type: "terminator", icon: Minus, color: "#101827", width: 166, height: 70, key: "start" },
];

const paletteColors = ["#3d8bff", "#ff7a00", "#1fc58a", "#8c5cf6", "#101827", "#ef476f"];

function makeInitialNodes(c) {
  return [
    { id: "node-1", type: "terminator", x: 96, y: 92, width: 168, height: 70, label: c.nodeStart, color: "#101827" },
    { id: "node-2", type: "process", x: 360, y: 92, width: 188, height: 78, label: c.nodeTask, color: "#3d8bff" },
    { id: "node-3", type: "decision", x: 642, y: 58, width: 146, height: 146, label: c.nodeDecision, color: "#ff7a00" },
    { id: "node-4", type: "document", x: 884, y: 90, width: 176, height: 96, label: c.nodeFinish, color: "#1fc58a" },
  ];
}

const initialLinks = [
  { id: "link-1", from: "node-1", to: "node-2" },
  { id: "link-2", from: "node-2", to: "node-3" },
  { id: "link-3", from: "node-3", to: "node-4" },
];

function centerOf(node) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function connectorPath(fromNode, toNode) {
  const from = centerOf(fromNode);
  const to = centerOf(toNode);
  const gap = Math.max(70, Math.abs(to.x - from.x) * 0.42);
  return `M ${from.x} ${from.y} C ${from.x + gap} ${from.y}, ${to.x - gap} ${to.y}, ${to.x} ${to.y}`;
}

function cloneState(nodes, links) {
  return {
    nodes: nodes.map((node) => ({ ...node })),
    links: links.map((link) => ({ ...link })),
  };
}

function FlowcraftEditorLanding() {
  const { lang } = useThemeLang();
  const c = copy[lang] ?? copy.en;
  const initialNodes = useMemo(() => makeInitialNodes(c), [c]);
  const boardRef = useRef(null);
  const dragRef = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);
  const [selectedId, setSelectedId] = useState("node-2");
  const [activeTool, setActiveTool] = useState("select");
  const [linkStartId, setLinkStartId] = useState(null);
  const [zoom, setZoom] = useState(0.88);
  const [history, setHistory] = useState([cloneState(initialNodes, initialLinks)]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const selectedNode = nodes.find((node) => node.id === selectedId) ?? null;

  const pushHistory = useCallback(
    (nextNodes, nextLinks) => {
      const snapshot = cloneState(nextNodes, nextLinks);
      setHistory((previous) => [...previous.slice(0, historyIndex + 1), snapshot].slice(-35));
      setHistoryIndex((index) => Math.min(index + 1, 34));
    },
    [historyIndex],
  );

  const commit = useCallback(
    (nextNodes, nextLinks = links) => {
      setNodes(nextNodes);
      setLinks(nextLinks);
      pushHistory(nextNodes, nextLinks);
    },
    [links, pushHistory],
  );

  const addShape = useCallback(
    (type, point) => {
      const shape = shapeCatalog.find((item) => item.type === type) ?? shapeCatalog[0];
      const nextNode = {
        id: `node-${Date.now()}`,
        type: shape.type,
        x: Math.max(24, Math.min((point?.x ?? 180 + nodes.length * 34) - shape.width / 2, CANVAS_WIDTH - shape.width - 24)),
        y: Math.max(24, Math.min((point?.y ?? 260 + nodes.length * 22) - shape.height / 2, CANVAS_HEIGHT - shape.height - 24)),
        width: shape.width,
        height: shape.height,
        label: c[shape.key],
        color: shape.color,
      };
      const nextNodes = [...nodes, nextNode];
      setSelectedId(nextNode.id);
      commit(nextNodes);
    },
    [c, commit, nodes],
  );

  const removeSelected = useCallback(() => {
    if (!selectedId) return;
    const nextNodes = nodes.filter((node) => node.id !== selectedId);
    const nextLinks = links.filter((link) => link.from !== selectedId && link.to !== selectedId);
    setSelectedId(nextNodes[0]?.id ?? null);
    commit(nextNodes, nextLinks);
  }, [commit, links, nodes, selectedId]);

  const duplicateSelected = useCallback(() => {
    if (!selectedNode) return;
    const clone = {
      ...selectedNode,
      id: `node-${Date.now()}`,
      x: Math.min(selectedNode.x + 42, CANVAS_WIDTH - selectedNode.width - 24),
      y: Math.min(selectedNode.y + 42, CANVAS_HEIGHT - selectedNode.height - 24),
    };
    setSelectedId(clone.id);
    commit([...nodes, clone]);
  }, [commit, nodes, selectedNode]);

  const undo = useCallback(() => {
    const nextIndex = Math.max(0, historyIndex - 1);
    const snapshot = history[nextIndex];
    if (!snapshot) return;
    setHistoryIndex(nextIndex);
    setNodes(cloneState(snapshot.nodes, snapshot.links).nodes);
    setLinks(cloneState(snapshot.nodes, snapshot.links).links);
    setSelectedId(snapshot.nodes[0]?.id ?? null);
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    const nextIndex = Math.min(history.length - 1, historyIndex + 1);
    const snapshot = history[nextIndex];
    if (!snapshot) return;
    setHistoryIndex(nextIndex);
    setNodes(cloneState(snapshot.nodes, snapshot.links).nodes);
    setLinks(cloneState(snapshot.nodes, snapshot.links).links);
    setSelectedId(snapshot.nodes[0]?.id ?? null);
  }, [history, historyIndex]);

  const handleNodeClick = useCallback(
    (nodeId) => {
      if (activeTool !== "connector") {
        setSelectedId(nodeId);
        return;
      }

      if (!linkStartId) {
        setLinkStartId(nodeId);
        setSelectedId(nodeId);
        return;
      }

      if (linkStartId === nodeId) {
        setLinkStartId(null);
        return;
      }

      const nextLinks = [...links, { id: `link-${Date.now()}`, from: linkStartId, to: nodeId }];
      setSelectedId(nodeId);
      setLinkStartId(null);
      commit(nodes, nextLinks);
    },
    [activeTool, commit, linkStartId, links, nodes],
  );

  const handlePointerDown = useCallback(
    (event, node) => {
      if (activeTool !== "select") return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setSelectedId(node.id);
      dragRef.current = {
        id: node.id,
        startX: event.clientX,
        startY: event.clientY,
        nodeX: node.x,
        nodeY: node.y,
      };
    },
    [activeTool],
  );

  const handlePointerMove = useCallback(
    (event) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = (event.clientX - drag.startX) / zoom;
      const dy = (event.clientY - drag.startY) / zoom;
      setNodes((previous) =>
        previous.map((node) =>
          node.id === drag.id
            ? {
                ...node,
                x: Math.max(12, Math.min(drag.nodeX + dx, CANVAS_WIDTH - node.width - 12)),
                y: Math.max(12, Math.min(drag.nodeY + dy, CANVAS_HEIGHT - node.height - 12)),
              }
            : node,
        ),
      );
    },
    [zoom],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/x-flowcraft-shape");
      if (!type || !boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      addShape(type, {
        x: (event.clientX - rect.left) / zoom,
        y: (event.clientY - rect.top) / zoom,
      });
    },
    [addShape, zoom],
  );

  const updateSelected = useCallback(
    (patch) => {
      if (!selectedId) return;
      setNodes((previous) => previous.map((node) => (node.id === selectedId ? { ...node, ...patch } : node)));
    },
    [selectedId],
  );

  const toolButtons = [
    { id: "select", label: c.select, icon: MousePointer2 },
    { id: "connector", label: c.connector, icon: Waypoints },
  ];

  return (
    <div className="flowcraft-site">
      <section className="flowcraft-app" aria-label={c.title}>
        <header className="flowcraft-ribbon">
          <div className="flowcraft-brand">
            <span>F</span>
            <div>
              <b>{c.brand}</b>
              <small>{c.title}</small>
            </div>
          </div>
          <nav className="flowcraft-ribbon-tabs" aria-label={c.title}>
            {[c.file, c.home, c.insert, c.design, c.view].map((item, index) => (
              <button className={index === 1 ? "is-active" : ""} type="button" key={item}>
                {item}
              </button>
            ))}
          </nav>
          <div className="flowcraft-ribbon-actions">
            <button type="button" onClick={undo} title={c.undo}>
              <Undo2 size={18} />
            </button>
            <button type="button" onClick={redo} title={c.redo}>
              <Redo2 size={18} />
            </button>
            <button type="button" title={c.save}>
              <Save size={18} />
              <span>{c.save}</span>
            </button>
            <button type="button" title={c.export}>
              <Download size={18} />
            </button>
            <button type="button" title={c.share}>
              <Share2 size={18} />
            </button>
          </div>
        </header>

        <div className="flowcraft-toolbar">
          <div className="flowcraft-tool-group">
            {toolButtons.map(({ id, label, icon: Icon }) => (
              <button
                className={activeTool === id ? "is-active" : ""}
                type="button"
                onClick={() => {
                  setActiveTool(id);
                  setLinkStartId(null);
                }}
                key={id}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="flowcraft-tool-group">
            <button type="button" onClick={duplicateSelected} disabled={!selectedNode}>
              <Copy size={18} />
              <span>{c.duplicate}</span>
            </button>
            <button type="button" onClick={removeSelected} disabled={!selectedNode}>
              <Trash2 size={18} />
              <span>{c.delete}</span>
            </button>
          </div>
          <div className="flowcraft-tool-group flowcraft-tool-group--zoom">
            <button type="button" onClick={() => setZoom((value) => Math.max(0.64, +(value - 0.08).toFixed(2)))}>
              <ZoomOut size={18} />
            </button>
            <strong>{Math.round(zoom * 100)}%</strong>
            <button type="button" onClick={() => setZoom((value) => Math.min(1.12, +(value + 0.08).toFixed(2)))}>
              <ZoomIn size={18} />
            </button>
          </div>
        </div>

        <div className="flowcraft-workspace">
          <aside className="flowcraft-left-panel">
            <section>
              <h2>{c.palette}</h2>
              <p>{c.dragHint}</p>
              <div className="flowcraft-shape-list">
                {shapeCatalog.map(({ type, icon: Icon, color, key }) => (
                  <button
                    type="button"
                    draggable
                    onClick={() => addShape(type)}
                    onDragStart={(event) => event.dataTransfer.setData("application/x-flowcraft-shape", type)}
                    key={type}
                  >
                    <span style={{ "--shape-color": color }}>
                      <Icon size={20} />
                    </span>
                    <b>{c[key]}</b>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2>{c.templates}</h2>
              {[c.templateA, c.templateB, c.templateC].map((item, index) => (
                <button className="flowcraft-template-button" type="button" key={item}>
                  <Grid3X3 size={16} />
                  <span>{item}</span>
                  <small>0{index + 1}</small>
                </button>
              ))}
            </section>
          </aside>

          <main className="flowcraft-board-shell">
            <div className="flowcraft-board-head">
              <div>
                <span>{c.title}</span>
                <h1>{c.subtitle}</h1>
              </div>
              <strong>{activeTool === "connector" ? c.connectHint : c.pageOne}</strong>
            </div>

            <div className="flowcraft-board-scroll" onDrop={handleDrop} onDragOver={(event) => event.preventDefault()}>
              <div
                className="flowcraft-board"
                ref={boardRef}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, transform: `scale(${zoom})` }}
              >
                <svg className="flowcraft-links" viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`} aria-hidden="true">
                  <defs>
                    <marker id="flowcraft-arrow" markerHeight="10" markerWidth="10" orient="auto" refX="8" refY="4">
                      <path d="M0,0 L0,8 L8,4 z" />
                    </marker>
                  </defs>
                  {links.map((link) => {
                    const from = nodes.find((node) => node.id === link.from);
                    const to = nodes.find((node) => node.id === link.to);
                    if (!from || !to) return null;
                    return <path d={connectorPath(from, to)} key={link.id} />;
                  })}
                </svg>

                {nodes.length === 0 && <div className="flowcraft-empty">{c.canvasEmpty}</div>}

                {nodes.map((node) => (
                  <button
                    className={[
                      "flowcraft-shape-node",
                      `flowcraft-shape-node--${node.type}`,
                      selectedId === node.id ? "is-selected" : "",
                      linkStartId === node.id ? "is-link-source" : "",
                    ].join(" ")}
                    type="button"
                    style={{
                      "--node-color": node.color,
                      left: node.x,
                      top: node.y,
                      width: node.width,
                      height: node.height,
                    }}
                    onPointerDown={(event) => handlePointerDown(event, node)}
                    onClick={() => handleNodeClick(node.id)}
                    key={node.id}
                  >
                    <span>{node.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </main>

          <aside className="flowcraft-right-panel">
            <section>
              <h2>{c.properties}</h2>
              {selectedNode ? (
                <>
                  <b>{c.selected}</b>
                  <label>
                    <span>{c.blockText}</span>
                    <input value={selectedNode.label} onChange={(event) => updateSelected({ label: event.target.value })} />
                  </label>
                  <div className="flowcraft-color-row" aria-label={c.color}>
                    {paletteColors.map((color) => (
                      <button
                        className={selectedNode.color === color ? "is-active" : ""}
                        type="button"
                        style={{ "--shape-color": color }}
                        onClick={() => updateSelected({ color })}
                        key={color}
                      />
                    ))}
                  </div>
                  <div className="flowcraft-property-actions">
                    <button type="button" onClick={duplicateSelected}>
                      <Copy size={16} />
                      {c.duplicate}
                    </button>
                    <button type="button" onClick={removeSelected}>
                      <Trash2 size={16} />
                      {c.delete}
                    </button>
                  </div>
                </>
              ) : (
                <p>{c.noSelection}</p>
              )}
            </section>

            <section>
              <h2>{c.pages}</h2>
              {[c.pageOne, c.pageTwo, c.pageThree].map((page, index) => (
                <button className={index === 0 ? "is-active" : ""} type="button" key={page}>
                  <AlignCenter size={16} />
                  <span>{page}</span>
                </button>
              ))}
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default FlowcraftEditorLanding;
