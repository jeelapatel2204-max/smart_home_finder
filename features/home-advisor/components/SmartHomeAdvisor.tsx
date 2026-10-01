"use client";

import { useState } from "react";
import type { Property } from "@/features/properties/data/properties";

type AdvisorAnswer = {
  title: string;
  body: string;
  checklist?: string[];
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function answerFor(
  question: string,
  property: Property,
  isRental: boolean,
  monthlyCost: number | null,
  monthlyLimit: number | null,
  neighborhoodScore: number,
): AdvisorAnswer {
  const text = question.toLowerCase();
  const monthlyAmount = isRental ? property.monthlyRentPrice ?? property.price : monthlyCost;
  const affordability = monthlyAmount !== null && monthlyLimit !== null
    ? monthlyAmount <= monthlyLimit
      ? `${money(monthlyLimit - monthlyAmount)} below your stated monthly comfort limit`
      : `${money(monthlyAmount - monthlyLimit)} above your stated monthly comfort limit`
    : null;

  if (/afford|cost|budget|monthly|pay/.test(text)) {
    return {
      title: "Affordability read",
      body: monthlyAmount === null
        ? "Set your mortgage assumptions to calculate a complete monthly estimate for this home."
        : isRental
          ? `Base rent is ${money(monthlyAmount)} per month. Add renter’s insurance, pet fees, utilities, and one-time move-in costs before deciding.`
          : `The current all-in estimate is ${money(monthlyAmount)} per month, including the known home costs. ${affordability ? `That is ${affordability}.` : "Set a monthly comfort limit in your decision dossier for a personalized comparison."}`,
      checklist: isRental ? ["Ask which utilities are included", "Confirm deposits and pet policy"] : ["Keep a repair reserve", "Confirm taxes and insurance quotes"],
    };
  }

  if (/neighbou?r|safe|school|walk|nearby|area/.test(text)) {
    return {
      title: "Neighborhood read",
      body: `This home’s neighborhood score is ${neighborhoodScore}/100. Its strongest recorded factors are ${property.neighborhood.schools >= 70 ? "schools" : "local amenities"} and ${property.neighborhood.safety >= 70 ? "safety" : "accessibility"}. Scores are a planning signal—not a substitute for visiting at different times of day.`,
      checklist: ["Visit during your usual commute", "Check parking, noise, and lighting", "Explore the route to your essentials"],
    };
  }

  if (/tour|visit|see|inspect|check/.test(text)) {
    return {
      title: "What to check in person",
      body: `Use a tour to test the parts a listing cannot show well: condition, light, sound, storage, and the feel of ${property.address}.`,
      checklist: isRental
        ? ["Ask about lease length and renewal", "Test cell signal and appliances", "Confirm parking and pet details"]
        : ["Ask for age and service records", "Look for drainage, cracks, and moisture", "Review disclosures and permits"],
    };
  }

  if (/fit|family|work|commute|life|space/.test(text)) {
    return {
      title: "Lifestyle fit",
      body: `With ${property.beds} bedrooms and ${property.squareFeet.toLocaleString()} sq ft, this ${property.propertyType.toLowerCase()} ${property.beds >= 3 ? "has flexible room for changing routines" : "may reward a simpler setup"}. Use the Daily Life card to add your commute and see how it could fit your week.`,
      checklist: ["Picture where work, guests, and storage go", "Try the commute at the time you travel", "Walk the block after dark"],
    };
  }

  return {
    title: "My take on this home",
    body: `${property.address} is a ${property.beds}-bed, ${property.baths}-bath ${property.propertyType.toLowerCase()} with a ${neighborhoodScore}/100 neighborhood score. Ask about affordability, the neighborhood, touring, or daily-life fit for a more focused answer.`,
  };
}

export function SmartHomeAdvisor({
  property,
  isRental,
  monthlyCost,
  monthlyLimit,
  neighborhoodScore,
}: {
  property: Property;
  isRental: boolean;
  monthlyCost: number | null;
  monthlyLimit: number | null;
  neighborhoodScore: number;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AdvisorAnswer>(() => answerFor("fit", property, isRental, monthlyCost, monthlyLimit, neighborhoodScore));

  function ask(nextQuestion: string) {
    setQuestion("");
    setAnswer(answerFor(nextQuestion, property, isRental, monthlyCost, monthlyLimit, neighborhoodScore));
  }

  return (
    <section className="smart-home-advisor" aria-labelledby="home-advisor-title">
      <div className="advisor-heading">
        <div>
          <p>Smart Home Advisor <span>Free</span></p>
          <h2 id="home-advisor-title">Ask about this home</h2>
        </div>
        <span className="advisor-status"><i /> Ready</span>
      </div>
      <p className="advisor-intro">A no-cost guide that turns this listing, your budget, and your priorities into clear next steps.</p>
      <div className="advisor-prompts" aria-label="Suggested questions">
        {["Can I afford this?", "What should I check on tour?", "How is the neighborhood?", "Does it fit my daily life?"].map((prompt) => (
          <button key={prompt} type="button" onClick={() => ask(prompt)}>{prompt}</button>
        ))}
      </div>
      <div className="advisor-answer" aria-live="polite">
        <strong>{answer.title}</strong>
        <p>{answer.body}</p>
        {answer.checklist && <ul>{answer.checklist.map((item) => <li key={item}>{item}</li>)}</ul>}
      </div>
      <form className="advisor-question" onSubmit={(event) => { event.preventDefault(); if (question.trim()) ask(question); }}>
        <label htmlFor={`advisor-question-${property.id}`}>Ask your own question</label>
        <div>
          <input id={`advisor-question-${property.id}`} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="e.g. What should I verify before I apply?" />
          <button type="submit">Ask</button>
        </div>
      </form>
      <small>Uses the listing and preferences already in this app. It does not send your information to an AI service.</small>
    </section>
  );
}
