const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Running seed...");

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Demo Restaurante",
      logo: null,
      address: "Av. Principal 123",
      phone: "+52 55 1234 5678",
      email: "demo@restaurante.local",
      currency: "MXN",
      timezone: "America/Mexico_City",
    },
  });

  const branch = await prisma.branch.create({
    data: {
      restaurantId: restaurant.id,
      name: "Sucursal Central",
      address: "Centro",
      phone: "+52 55 0000 0000",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "admin@demo.local",
      password: "password",
      firstName: "Admin",
      lastName: "Demo",
      role: "OWNER",
      restaurantId: restaurant.id,
    },
  });

  const item1 = await prisma.inventoryItem.create({
    data: {
      tenantId: restaurant.id,
      branchId: branch.id,
      name: "Tomate",
      sku: "TOM-001",
      category: "Verduras",
      unit: "kg",
      currentStock: 120,
      minStock: 10,
      costPerUnit: 0.8,
      supplier: "Proveedor A",
    },
  });

  const item2 = await prisma.inventoryItem.create({
    data: {
      tenantId: restaurant.id,
      branchId: branch.id,
      name: "Lechuga",
      sku: "LEC-001",
      category: "Verduras",
      unit: "unit",
      currentStock: 80,
      minStock: 5,
      costPerUnit: 0.5,
      supplier: "Proveedor B",
    },
  });

  const customer = await prisma.customer.create({
    data: {
      tenantId: restaurant.id,
      name: "Cliente Prueba",
      phone: "+52 55 9999 9999",
      email: "cliente@demo.local",
      notes: "Cliente frecuente",
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      tenantId: restaurant.id,
      customerId: customer.id,
      assignedToId: user.id,
      channel: "WEB",
      status: "OPEN",
      tags: {},
      metadata: {},
    },
  });

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      content: "Hola, quiero hacer una reservación para hoy a las 8pm",
      direction: "inbound",
      isRead: false,
    },
  });

  const recipe = await prisma.recipe.create({
    data: {
      tenantId: restaurant.id,
      name: "Ensalada mixta",
      description: "Ensalada con tomate y lechuga",
    },
  });

  await prisma.recipeIngredient.create({
    data: {
      recipeId: recipe.id,
      inventoryItemId: item1.id,
      quantity: 0.2,
      unit: "kg",
    },
  });

  await prisma.recipeIngredient.create({
    data: {
      recipeId: recipe.id,
      inventoryItemId: item2.id,
      quantity: 1,
      unit: "unit",
    },
  });

  await prisma.subscription.create({
    data: {
      restaurantId: restaurant.id,
      plan: "STARTER",
      status: "ACTIVE",
      price: 29.99,
      maxBranches: 2,
      maxUsers: 5,
    },
  });

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
