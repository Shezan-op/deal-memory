import { Deal, Company, Stakeholder, Interaction, InteractionOutcome } from '../domain/models';
import { DEMO_DEALS, DEMO_COMPANIES, DEMO_STAKEHOLDERS, DEMO_INTERACTIONS } from '../domain/fixtures';

/**
 * In-memory repository supporting state mutations, demo reset, and query operations.
 * Holds domain entities alongside Hindsight (which owns the durable memory lifecycle).
 */
export class DealRepository {
  private static instance: DealRepository;

  private deals: Map<string, Deal> = new Map();
  private companies: Map<string, Company> = new Map();
  private stakeholders: Map<string, Stakeholder> = new Map();
  private interactions: Map<string, Interaction> = new Map();

  private constructor() {
    this.reset();
  }

  static getInstance(): DealRepository {
    if (!DealRepository.instance) {
      DealRepository.instance = new DealRepository();
    }
    return DealRepository.instance;
  }

  reset(): void {
    this.deals.clear();
    this.companies.clear();
    this.stakeholders.clear();
    this.interactions.clear();

    for (const c of DEMO_COMPANIES) this.companies.set(c.id, { ...c });
    for (const s of DEMO_STAKEHOLDERS) this.stakeholders.set(s.id, { ...s });
    for (const d of DEMO_DEALS) this.deals.set(d.id, { ...d });
    for (const i of DEMO_INTERACTIONS) this.interactions.set(i.id, { ...i });
  }

  getDeals(): Deal[] {
    return Array.from(this.deals.values());
  }

  getDeal(id: string): Deal | undefined {
    return this.deals.get(id);
  }

  getCompany(id: string): Company | undefined {
    return this.companies.get(id);
  }

  getStakeholder(id: string): Stakeholder | undefined {
    return this.stakeholders.get(id);
  }

  getStakeholdersForDeal(dealId: string): Stakeholder[] {
    const deal = this.deals.get(dealId);
    if (!deal) return [];
    return deal.stakeholderIds
      .map((sid) => this.stakeholders.get(sid))
      .filter((s): s is Stakeholder => Boolean(s));
  }

  getInteractionsForDeal(dealId: string): Interaction[] {
    return Array.from(this.interactions.values())
      .filter((i) => i.dealId === dealId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  getInteraction(id: string): Interaction | undefined {
    return this.interactions.get(id);
  }

  addInteraction(interaction: Interaction): Interaction {
    this.interactions.set(interaction.id, { ...interaction });

    // Update deal interaction metrics
    const deal = this.deals.get(interaction.dealId);
    if (deal) {
      deal.interactionCount += 1;
      deal.lastInteractionDate = interaction.timestamp;
      this.deals.set(deal.id, deal);
    }

    return interaction;
  }

  recordOutcome(interactionId: string, outcome: InteractionOutcome): Interaction | undefined {
    const interaction = this.interactions.get(interactionId);
    if (!interaction) return undefined;

    interaction.outcome = outcome;
    this.interactions.set(interactionId, interaction);

    return interaction;
  }
}

export const dealRepository = DealRepository.getInstance();
