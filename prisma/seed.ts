import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Innovate.AI database...')

  // Demo user
  const user = await prisma.user.upsert({
    where: { id: 'demo-user-001' },
    update: {},
    create: {
      id: 'demo-user-001',
      email: 'john.demo@innovate-ai.com.au',
      name: 'John Demo',
      role: 'agent',
      agencyName: 'Innovate.AI Realty',
      primaryColor: '#FFD940',
    },
  })
  console.log('✅ User created:', user.name)

  // Contacts
  const contacts = await Promise.all([
    prisma.contact.upsert({ where: { id: 'contact-001' }, update: {}, create: { id: 'contact-001', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.m@email.com', mobile: '0412345678', type: 'buyer', suburb: 'Wollongong', postcode: '2500', source: 'web', rating: 5, tags: JSON.stringify(['hot', 'beach']) } }),
    prisma.contact.upsert({ where: { id: 'contact-002' }, update: {}, create: { id: 'contact-002', firstName: 'James', lastName: 'Wong', email: 'jwong@gmail.com', mobile: '0423456789', type: 'buyer', suburb: 'Thirroul', postcode: '2515', source: 'social', rating: 4, tags: JSON.stringify(['investor']) } }),
    prisma.contact.upsert({ where: { id: 'contact-003' }, update: {}, create: { id: 'contact-003', firstName: 'Emily', lastName: 'Clarke', email: 'emily.c@work.com', mobile: '0434567890', type: 'vendor', suburb: 'Bulli', postcode: '2516', source: 'referral', rating: 3, tags: JSON.stringify(['vendor']) } }),
    prisma.contact.upsert({ where: { id: 'contact-004' }, update: {}, create: { id: 'contact-004', firstName: 'Michael', lastName: 'Torres', email: 'm.torres@email.com', mobile: '0445678901', type: 'buyer', suburb: 'Corrimal', postcode: '2518', source: 'portal', rating: 2, tags: JSON.stringify(['first-home']) } }),
    prisma.contact.upsert({ where: { id: 'contact-005' }, update: {}, create: { id: 'contact-005', firstName: 'Lisa', lastName: 'Park', email: 'lisa.park@biz.com', mobile: '0456789012', type: 'investor', suburb: 'Wollongong', postcode: '2500', source: 'referral', rating: 4, tags: JSON.stringify(['investor', 'multiple']) } }),
  ])
  console.log('✅ Contacts created:', contacts.length)

  // Properties
  await prisma.property.upsert({
    where: { id: 'prop-001' },
    update: {},
    create: {
      id: 'prop-001',
      agentId: 'demo-user-001',
      address: '12 Ocean Ave',
      suburb: 'Wollongong',
      state: 'NSW',
      postcode: '2500',
      bedrooms: 3,
      bathrooms: 2,
      carSpaces: 2,
      price: 875000,
      displayPrice: '$850,000 - $900,000',
      status: 'active',
      listingType: 'sale',
      propertyClass: 'residential',
      features: JSON.stringify(['Ocean views', 'Renovated kitchen', 'Deck entertaining', 'Walk to beach']),
      description: 'Stunning coastal home with breathtaking ocean views and premium finishes throughout.',
      listedDate: new Date(Date.now() - 8 * 86400000),
    },
  })

  await prisma.property.upsert({
    where: { id: 'prop-002' },
    update: {},
    create: {
      id: 'prop-002',
      agentId: 'demo-user-001',
      address: '7 Beach Rd',
      suburb: 'Thirroul',
      state: 'NSW',
      postcode: '2515',
      bedrooms: 4,
      bathrooms: 3,
      carSpaces: 2,
      price: 1150000,
      displayPrice: '$1,100,000 - $1,200,000',
      status: 'active',
      listingType: 'sale',
      propertyClass: 'residential',
      features: JSON.stringify(['Architect design', 'Pool', 'Double garage', 'Sea glimpses']),
      description: 'Architect-designed masterpiece steps from Thirroul beach.',
      listedDate: new Date(Date.now() - 14 * 86400000),
    },
  })
  console.log('✅ Properties created')

  // Leads
  await Promise.all([
    prisma.lead.upsert({ where: { id: 'lead-001' }, update: {}, create: { id: 'lead-001', contactId: 'contact-001', propertyId: 'prop-001', assignedTo: 'demo-user-001', status: 'hot', source: 'email', score: 92, budget: 900000, lastContact: new Date() } }),
    prisma.lead.upsert({ where: { id: 'lead-002' }, update: {}, create: { id: 'lead-002', contactId: 'contact-002', propertyId: 'prop-001', assignedTo: 'demo-user-001', status: 'qualified', source: 'social', score: 78, budget: 800000 } }),
    prisma.lead.upsert({ where: { id: 'lead-003' }, update: {}, create: { id: 'lead-003', contactId: 'contact-003', propertyId: 'prop-002', assignedTo: 'demo-user-001', status: 'contacted', source: 'sms', score: 64, budget: 1100000 } }),
    prisma.lead.upsert({ where: { id: 'lead-004' }, update: {}, create: { id: 'lead-004', contactId: 'contact-004', assignedTo: 'demo-user-001', status: 'new', source: 'portal', score: 45, budget: 650000 } }),
    prisma.lead.upsert({ where: { id: 'lead-005' }, update: {}, create: { id: 'lead-005', contactId: 'contact-005', propertyId: 'prop-002', assignedTo: 'demo-user-001', status: 'nurturing', source: 'referral', score: 71, budget: 1200000 } }),
  ])
  console.log('✅ Leads created')

  // Email campaign
  await prisma.emailCampaign.upsert({
    where: { id: 'campaign-001' },
    update: {},
    create: {
      id: 'campaign-001',
      creatorId: 'demo-user-001',
      propertyId: 'prop-001',
      name: '12 Ocean Ave Launch',
      subject: "New Listing: Stunning Coastal Home You've Been Waiting For",
      previewText: 'Breathtaking ocean views from $850,000',
      htmlBody: '<html><body><h1>12 Ocean Ave, Wollongong</h1><p>Your dream coastal home awaits.</p></body></html>',
      fromName: 'John Demo',
      fromEmail: 'john@innovate-ai.com.au',
      campaignType: 'listing',
      status: 'sent',
      sentAt: new Date(Date.now() - 2 * 86400000),
      totalRecipients: 342,
      delivered: 340,
      opened: 144,
      clicked: 29,
      bounced: 2,
    },
  })

  await prisma.smsCampaign.upsert({
    where: { id: 'sms-001' },
    update: {},
    create: {
      id: 'sms-001',
      creatorId: 'demo-user-001',
      propertyId: 'prop-001',
      name: 'Ocean Ave SMS Blast',
      body: 'Hi {firstName}! 12 Ocean Ave just listed at $850k-$900k. 3bed/2bath, ocean views. Open Sat 10am. Reply YES to register!',
      campaignType: 'listing',
      status: 'sent',
      sentAt: new Date(Date.now() - 2 * 86400000),
      totalRecipients: 189,
      delivered: 186,
      replies: 52,
    },
  })

  await prisma.socialPost.upsert({
    where: { id: 'social-001' },
    update: {},
    create: {
      id: 'social-001',
      authorId: 'demo-user-001',
      propertyId: 'prop-001',
      platforms: JSON.stringify(['facebook', 'instagram']),
      caption: '🌊 Just Listed! 12 Ocean Ave, Wollongong — 3 bed, 2 bath coastal dream with breathtaking ocean views.',
      hashtags: JSON.stringify(['#wollongong', '#realestate', '#coastal', '#justlisted']),
      campaignType: 'listing',
      status: 'published',
      publishedAt: new Date(Date.now() - 2 * 86400000),
      impressions: 4820,
      reach: 3200,
      clicks: 156,
      engagement: 248,
    },
  })

  console.log('✅ Campaigns & posts created')
  console.log('🎉 Seeding complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
