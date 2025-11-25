import { jsPDF } from "jspdf";
import { SavedIdea } from "../types";
import { getCurrentUserProfile } from "./profileService";

export const generateProjectReport = async (idea: SavedIdea) => {
  // ✅ Vérifier le plan de l'utilisateur avant de générer le PDF
  const profile = await getCurrentUserProfile();

  if (!profile) {
    alert("Vous devez être connecté pour exporter en PDF.");
    return;
  }

  const plan = profile.plan || "camp_de_base";

  // Petit helper pour ouvrir la modale Pricing depuis n'importe où
  const triggerPricingCTA = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sommet:open_pricing"));
    }
  };

  // 🚫 Plan gratuit : aucun export PDF possible + CTA
  if (plan === "camp_de_base") {
    const goToPricing = window.confirm(
      "L'export PDF est réservé aux offres Explorateur et Bâtisseur.\n\nVoulez-vous découvrir les offres Sommet ?"
    );

    if (goToPricing) {
      triggerPricingCTA();
    }
    return;
  }

  // 🎫 Explorateur : 1 seul export PDF autorisé (stocké côté client)
  if (plan === "explorateur") {
    const key = "sommet_pdf_exports_count";
    let count = 0;

    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(key);
      count = raw ? parseInt(raw, 10) || 0 : 0;
    }

    if (count >= 1) {
      const upgrade = window.confirm(
        "Vous avez déjà utilisé votre export PDF inclus avec l'offre Explorateur.\n\nPassez à l'offre Bâtisseur pour débloquer des exports illimités et une exécution guidée avec Le Chantier.\n\nVoulez-vous voir les offres disponibles ?"
      );

      if (upgrade) {
        triggerPricingCTA();
      }
      return;
    }

    // Première export Explorateur → on incrémente le compteur
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, String(count + 1));
    }
  }

  // ✅ Si on arrive ici → Explorateur (quota OK) ou Bâtisseur : on génère le PDF

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;
  let sectionCounter = 1;

  // Colors
  const colorBrandBlue = "#0F172A";
  const colorGold = "#D4AF37";
  const colorGray = "#64748B";
  const colorLightGray = "#E2E8F0";
  const colorGreen = "#22c55e";
  const colorRed = "#ef4444";

  // --- HELPER FUNCTIONS ---

  const checkPageBreak = (neededSpace: number = 20) => {
    if (cursorY + neededSpace > pageHeight - margin) {
      doc.addPage();
      cursorY = 20;
      return true;
    }
    return false;
  };

  const addTitle = (
    text: string,
    size: number = 24,
    color: string = colorBrandBlue,
    align: "left" | "center" = "left"
  ) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(color);

    const safeWidth = contentWidth - 10;
    const lines = doc.splitTextToSize(text, safeWidth);
    const lineHeight = size * 0.4;

    if (align === "center") {
      doc.text(lines, pageWidth / 2, cursorY, { align: "center" });
    } else {
      doc.text(lines, margin, cursorY);
    }
    cursorY += lines.length * lineHeight + 6;
  };

  const addSubtitle = (text: string, lookahead: number = 0) => {
    checkPageBreak(15 + lookahead);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(colorGold);
    doc.text(text.toUpperCase(), margin, cursorY);
    cursorY += 10;
  };

  const addParagraph = (
    text: string,
    fontSize: number = 10,
    color: string = colorBrandBlue,
    fontStyle: string = "normal"
  ) => {
    doc.setFont("helvetica", fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color);

    const lines = doc.splitTextToSize(text, contentWidth - 5);
    const lineHeight = fontSize * 0.5;
    const blockHeight = lines.length * lineHeight + 4;

    checkPageBreak(blockHeight);

    doc.text(lines, margin, cursorY);
    cursorY += blockHeight + 2;
  };

  const drawDivider = () => {
    checkPageBreak(15);
    doc.setDrawColor(colorLightGray);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 10;
  };

  const drawArc = (
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    color: string,
    lineWidth: number
  ) => {
    doc.setDrawColor(color);
    doc.setLineWidth(lineWidth);

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const step = (3 * Math.PI) / 180;
    let currentAngle = startRad;

    while (currentAngle < endRad) {
      const nextAngle = Math.min(currentAngle + step, endRad);
      const x1 = cx + radius * Math.cos(currentAngle);
      const y1 = cy + radius * Math.sin(currentAngle);
      const x2 = cx + radius * Math.cos(nextAngle);
      const y2 = cy + radius * Math.sin(nextAngle);
      doc.line(x1, y1, x2, y2);
      currentAngle = nextAngle;
    }
  };

  // --- HEADER ---
  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.setTextColor(colorBrandBlue);
  doc.text("SOMMET", pageWidth - margin, 20, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(colorGold);
  doc.text("DE L'IDÉE À LA LICORNE", pageWidth - margin, 26, {
    align: "right",
  });

  cursorY = 40;
  addTitle(idea.title, 24, colorBrandBlue, "left");

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(colorGray);
  const taglineLines = doc.splitTextToSize(
    `"${idea.tagline}"`,
    contentWidth - 10
  );
  doc.text(taglineLines, margin, cursorY);
  cursorY += taglineLines.length * 6 + 10;

  doc.setFontSize(9);
  doc.setTextColor(colorGray);
  doc.text(
    `Généré le ${new Date(idea.savedAt).toLocaleDateString()}`,
    margin,
    cursorY
  );
  cursorY += 15;

  drawDivider();

  // --- 1. CONCEPT ---
  addSubtitle(`${sectionCounter++}. Le Concept`, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(colorBrandBlue);
  doc.text("Description :", margin, cursorY);
  cursorY += 5;
  addParagraph(idea.description);

  checkPageBreak(30);

  doc.setFont("helvetica", "bold");
  doc.text("Cible :", margin, cursorY);
  doc.setFont("helvetica", "normal");
  const targetLines = doc.splitTextToSize(
    idea.targetAudience,
    contentWidth - 40
  );
  doc.text(targetLines, margin + 30, cursorY);
  cursorY += targetLines.length * 5 + 4;

  checkPageBreak(15);
  doc.setFont("helvetica", "bold");
  doc.text("Modèle Eco :", margin, cursorY);
  doc.setFont("helvetica", "normal");
  const modelLines = doc.splitTextToSize(
    idea.revenueModel,
    contentWidth - 40
  );
  doc.text(modelLines, margin + 30, cursorY);
  cursorY += modelLines.length * 5 + 4;

  checkPageBreak(15);
  doc.setFont("helvetica", "bold");
  doc.text("Catégorie :", margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text(idea.category, margin + 30, cursorY);
  cursorY += 15;

  drawDivider();

  // --- 2. ANALYSE (VISUAL GAUGE) ---
  if (idea.analysis) {
    addSubtitle(`${sectionCounter++}. Audit & Stratégie`, 50);

    checkPageBreak(50);
    const gaugeCenterY = cursorY + 20;
    const gaugeCenterX = margin + 18;
    const gaugeRadius = 12;

    drawArc(gaugeCenterX, gaugeCenterY, gaugeRadius, 0, 360, colorLightGray, 3);

    const scoreColor =
      idea.analysis.score >= 80
        ? colorGreen
        : idea.analysis.score >= 60
        ? colorGold
        : colorRed;
    const endAngle = (idea.analysis.score / 100) * 360;
    drawArc(gaugeCenterX, gaugeCenterY, gaugeRadius, 0, endAngle, scoreColor, 3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(colorBrandBlue);
    doc.text(`${idea.analysis.score}`, gaugeCenterX, gaugeCenterY, {
      align: "center",
      baseline: "middle",
    });

    const textStartX = margin + 45;
    let textCursorY = cursorY + 10;

    doc.setFontSize(11);
    doc.setTextColor(colorBrandBlue);
    doc.text("Score de Viabilité", textStartX, textCursorY);

    textCursorY += 7;
    doc.setFontSize(10);
    doc.setTextColor(colorGray);
    doc.setFont("helvetica", "italic");

    const verdictLines = doc.splitTextToSize(
      `"${idea.analysis.verdict}"`,
      contentWidth - 50
    );
    doc.text(verdictLines, textStartX, textCursorY);

    cursorY = Math.max(
      gaugeCenterY + 20,
      textCursorY + verdictLines.length * 5 + 10
    );

    checkPageBreak(30);
    doc.setFont("helvetica", "bold");
    doc.setFont("helvetica", "normal");
    doc.setFont("helvetica", "bold");
    doc.text("Go-To-Market :", margin, cursorY);
    cursorY += 6;
    addParagraph(idea.analysis.go_to_market);

    drawDivider();
  }

  // --- 3. BLUEPRINT MVP (Optional) ---
  if (idea.blueprint) {
    addSubtitle(`${sectionCounter++}. Plan d'Action MVP`, 50);

    const boxPaddingTop = 8;
    const boxPaddingBottom = 8;
    const boxInnerWidth = contentWidth - 10;
    const lineHeightNormal = 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const nameLines = doc.splitTextToSize(
      idea.blueprint.coreFeature.name.toUpperCase(),
      boxInnerWidth
    );
    const nameHeight = nameLines.length * 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const descLines = doc.splitTextToSize(
      idea.blueprint.coreFeature.description,
      boxInnerWidth
    );
    const descHeight = descLines.length * lineHeightNormal;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const valuePropText = `Pourquoi : ${idea.blueprint.coreFeature.valueProp}`;
    const valuePropLines = doc.splitTextToSize(valuePropText, boxInnerWidth);
    const valuePropHeight = valuePropLines.length * lineHeightNormal;

    const totalBoxHeight =
      boxPaddingTop +
      5 +
      5 +
      nameHeight +
      5 +
      descHeight +
      5 +
      valuePropHeight +
      boxPaddingBottom;

    checkPageBreak(totalBoxHeight + 10);

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, cursorY, contentWidth, totalBoxHeight, "F");

    let boxCursorY = cursorY + boxPaddingTop;

    doc.setTextColor(colorBrandBlue);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("FEATURE UNIQUE (MVP)", margin + 5, boxCursorY);
    boxCursorY += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(colorGold);
    doc.text(nameLines, margin + 5, boxCursorY);
    boxCursorY += nameHeight + 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colorBrandBlue);
    doc.text(descLines, margin + 5, boxCursorY);
    boxCursorY += descHeight + 5;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(colorGray);
    doc.text(valuePropLines, margin + 5, boxCursorY);

    cursorY += totalBoxHeight + 15;

    addSubtitle("Arsenal Technique", 30);

    idea.blueprint.techStack.forEach((tool) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const reasonLines = doc.splitTextToSize(tool.reason, contentWidth - 5);
      const itemHeight = 15 + reasonLines.length * 5;

      checkPageBreak(itemHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(colorBrandBlue);
      doc.text(`• ${tool.toolName} (${tool.category})`, margin, cursorY);
      cursorY += 5;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(colorGray);
      doc.text(reasonLines, margin + 5, cursorY);
      cursorY += reasonLines.length * 5 + 5;
    });

    cursorY += 5;

    addSubtitle("Roadmap (4 Semaines)", 40);

    idea.blueprint.roadmap.forEach((step) => {
      let tasksHeight = 0;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      step.tasks.forEach((task) => {
        const taskLines = doc.splitTextToSize(`- ${task}`, contentWidth - 5);
        tasksHeight += taskLines.length * 5;
      });
      const stepHeaderHeight = 8;
      const stepTotalHeight = stepHeaderHeight + tasksHeight + 5;

      checkPageBreak(stepTotalHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(colorBrandBlue);
      doc.text(`Semaine ${step.week} : ${step.phase}`, margin, cursorY);
      cursorY += 6;

      step.tasks.forEach((task) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(colorGray);
        const taskLines = doc.splitTextToSize(`- ${task}`, contentWidth - 5);
        doc.text(taskLines, margin, cursorY);
        cursorY += taskLines.length * 5;
      });
      cursorY += 4;
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} sur ${pageCount} - Généré par Sommet.tech`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
    doc.text(`© 2025 Sommet.tech`, pageWidth - margin, pageHeight - 10, {
      align: "right",
    });
  }

  doc.save(`Sommet_Rapport_${idea.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
};
