import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('site invitations', () => {
  // Currently fails with EMAIL_NOT_VERIFIED because the test account's
  // email isn't verified. Since site invitations aren't used much via the
  // client, we're skipping this test for now.
  it.concurrent.skip('create, find, all, destroy', async () => {
    const client = await generateNewCmaClient();

    const roles = await client.roles.list();

    const invitation = await client.siteInvitations.create({
      email: 'user.tester@datocms.com',
      role: { id: roles[0]!.id, type: 'role' },
    });

    const foundInvitation = await client.siteInvitations.find(invitation.id);
    expect(foundInvitation.id).toEqual(invitation.id);

    const allInvitations = await client.siteInvitations.list();
    expect(allInvitations).toHaveLength(1);

    await client.siteInvitations.resend(invitation.id);

    await client.siteInvitations.destroy(foundInvitation.id);
  });
});
