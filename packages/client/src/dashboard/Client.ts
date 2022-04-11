import * as Resources from './resources';
import request, { RequestOptions, ClientConfigOptions } from '../request';
import { subscribeToEvents, EventsSubscription } from '../subscribeToEvents';
import pollJobResult from '../pollJobResult';

export class Client {
  static readonly defaultBaseUrl = 'https://account-api.datocms.com';

  session: Resources.Session;
  account: Resources.Account;
  sites: Resources.Site;
  siteSubscription: Resources.SiteSubscription;
  accountSubscription: Resources.AccountSubscription;
  sitePlans: Resources.SitePlan;
  accountPlans: Resources.AccountPlan;
  perSitePricingBillingProfiles: Resources.PerSitePricingBillingProfile;
  perAccountPricingBillingProfile: Resources.PerAccountPricingBillingProfile;
  invoices: Resources.Invoice;
  resourceUsages: Resources.ResourceUsage;
  jobResults: Resources.JobResult;
  siteTransfers: Resources.SiteTransfer;
  siteInvitation: Resources.SiteInvitation;
  subscriptionLimits: Resources.SubscriptionLimit;
  subscriptionFeatures: Resources.SubscriptionFeature;

  private config: ClientConfigOptions;
  private eventsSubscription?: EventsSubscription;

  constructor(config: ClientConfigOptions) {
    this.config = config;
    this.session = new Resources.Session(this);
    this.account = new Resources.Account(this);
    this.sites = new Resources.Site(this);
    this.siteSubscription = new Resources.SiteSubscription(this);
    this.accountSubscription = new Resources.AccountSubscription(this);
    this.sitePlans = new Resources.SitePlan(this);
    this.accountPlans = new Resources.AccountPlan(this);
    this.perSitePricingBillingProfiles =
      new Resources.PerSitePricingBillingProfile(this);
    this.perAccountPricingBillingProfile =
      new Resources.PerAccountPricingBillingProfile(this);
    this.invoices = new Resources.Invoice(this);
    this.resourceUsages = new Resources.ResourceUsage(this);
    this.jobResults = new Resources.JobResult(this);
    this.siteTransfers = new Resources.SiteTransfer(this);
    this.siteInvitation = new Resources.SiteInvitation(this);
    this.subscriptionLimits = new Resources.SubscriptionLimit(this);
    this.subscriptionFeatures = new Resources.SubscriptionFeature(this);
  }

  get baseUrl() {
    return this.config.baseUrl || Client.defaultBaseUrl;
  }

  request<T>(options: RequestOptions) {
    return request<T>({
      ...this.config,
      ...options,
      baseUrl: this.baseUrl,
      preCallStack: new Error().stack,
      fetchJobResult: (jobId: string) => {
        if (this.eventsSubscription) {
          return this.eventsSubscription.waitJobResult(jobId);
        }
        return pollJobResult(() => this.jobResults.rawFind(jobId));
      },
    });
  }

  async subscribeToEvents(): Promise<void> {
    if (!this.config.apiToken) {
      throw new Error('Missing API token!');
    }

    const { data: account } = await this.account.rawFind();

    this.eventsSubscription = await subscribeToEvents(
      `${this.baseUrl}/pusher/authenticate`,
      this.config.apiToken,
      `private-account-${account.id}`,
    );
  }

  get eventsChannel() {
    if (!this.eventsSubscription) {
      return;
    }

    return this.eventsSubscription.channel;
  }

  unsubscribeToEvents() {
    if (!this.eventsSubscription) {
      return;
    }

    return this.eventsSubscription.unsubscribe();
  }
}
