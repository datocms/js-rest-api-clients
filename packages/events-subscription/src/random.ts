// async subscribeToEvents(): Promise<void> {
//   if (!this.config.apiToken) {
//     throw new Error('Missing API token!');
//   }

//   {{#if isCma}}
//     const { data: site } = await this.site.rawFind();

//     this.eventsSubscription = await subscribeToEvents(
//       `${this.baseUrl}/pusher/authenticate`,
//       this.config.apiToken,
//       this.config.environment
//         ? `private-site-${site.id}-environment-${this.config.environment}`
//         : `private-site-${site.id}`,
//     );
//   {{else}}
//     const { data: account } = await this.account.rawFind();

//     this.eventsSubscription = await subscribeToEvents(
//       `${this.baseUrl}/pusher/authenticate`,
//       this.config.apiToken,
//       `private-account-${account.id}`,
//     );
//   {{/if}}
// }

// get eventsChannel() {
//   if (!this.eventsSubscription) {
//     return;
//   }

//   return this.eventsSubscription.channel;
// }

// unsubscribeToEvents() {
//   if (!this.eventsSubscription) {
//     return;
//   }

//   return this.eventsSubscription.unsubscribe();
// }

export default 1;
