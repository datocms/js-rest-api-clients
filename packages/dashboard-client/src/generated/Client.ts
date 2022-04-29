import * as Resources from './resources';
import { request, pollJobResult, LogLevel } from '@datocms/rest-client-utils';
import { JobResult } from './SimpleSchemaTypes';

export type RequestOptions = {
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  url: string;
  queryParams?: Record<string, unknown>;
  body?: unknown;
  preCallStack?: string;
};

export type ClientConfigOptions = {
  apiToken: string | null;
  baseUrl?: string;
  extraHeaders?: Record<string, string>;
  logLevel?: LogLevel;
  logFn?: (message: string) => void;
  autoRetry?: boolean;
};

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

  config: ClientConfigOptions;
  jobResultsFetcher?: (jobId: string) => Promise<JobResult>;

  private cachedEventsChannelName: string | undefined;

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
      logFn: this.config.logFn || console.log,
      userAgent: `@datocms/dashboard-client`,
      baseUrl: this.baseUrl,
      preCallStack: new Error().stack,
      fetchJobResult: (jobId: string) => {
        return this.jobResultsFetcher
          ? this.jobResultsFetcher(jobId)
          : pollJobResult(() => this.jobResults.find(jobId));
      },
    });
  }

  async eventsChannelName() {
    if (this.cachedEventsChannelName) {
      return this.cachedEventsChannelName;
    }

    const { data: account } = await this.account.rawFind();

    this.cachedEventsChannelName = `private-account-${account.id}`;

    return this.cachedEventsChannelName;
  }
}
