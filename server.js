import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// CORS mit allen erlaubten Methoden konfigurieren
await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Alle Rezepte abrufen
fastify.get('/api/recipes', async (request, reply) => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: true,
        steps: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return recipes;
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ error: "Fehler beim Laden der Rezepte aus der Datenbank" });
  }
});

// Neues Rezept erstellen
fastify.post('/api/recipes', async (request, reply) => {
  try {
    const { title, category, time, heatLevel, image, tags, baseServings, ingredients, steps } = request.body;

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        category,
        time: parseInt(time, 10) || 30,
        heatLevel: parseInt(heatLevel, 10) || 3,
        image,
        tags: tags || [],
        baseServings: parseInt(baseServings, 10) || 2,
        ingredients: {
          create: ingredients.map(i => ({
            name: i.name,
            amount: parseFloat(i.amount) || 1,
            unit: i.unit || ''
          }))
        },
        steps: {
          create: steps.map((s, index) => ({
            stepNumber: index + 1,
            instruction: typeof s === 'string' ? s : s.instruction
          }))
        }
      },
      include: {
        ingredients: true,
        steps: true
      }
    });

    reply.code(201).send(newRecipe);
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ error: "Fehler beim Speichern des Rezepts in der Datenbank" });
  }
});

// Rezept bearbeiten/aktualisieren
fastify.put('/api/recipes/:id', async (request, reply) => {
  const { id } = request.params;
  const { title, category, time, heatLevel, image, tags, baseServings, ingredients, steps } = request.body;

  try {
    // Vorherige verknüpfte Einträge (Zutaten & Schritte) sauber löschen, um Konflikte zu vermeiden
    await prisma.ingredient.deleteMany({ where: { recipeId: id } });
    await prisma.step.deleteMany({ where: { recipeId: id } });

    // Rezept aktualisieren und neue Zutaten & Schritte anlegen
    const updatedRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        category,
        time: parseInt(time, 10) || 30,
        heatLevel: parseInt(heatLevel, 10) || 3,
        image,
        tags: tags || [],
        baseServings: parseInt(baseServings, 10) || 2,
        ingredients: {
          create: ingredients.map(i => ({
            name: i.name,
            amount: parseFloat(i.amount) || 1,
            unit: i.unit || ''
          }))
        },
        steps: {
          create: steps.map((s, index) => ({
            stepNumber: index + 1,
            instruction: typeof s === 'string' ? s : s.instruction
          }))
        }
      },
      include: {
        ingredients: true,
        steps: true
      }
    });

    return reply.code(200).send(updatedRecipe);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ error: 'Rezept konnte nicht aktualisiert werden' });
  }
});

// Rezept löschen (inklusive verknüpfter Zutaten und Schritte)
fastify.delete('/api/recipes/:id', async (request, reply) => {
  const { id } = request.params;
  try {
    // Verknüpfte Einträge zuerst löschen, um Fremdschlüsselkonflikte zu vermeiden
    await prisma.ingredient.deleteMany({ where: { recipeId: id } });
    await prisma.step.deleteMany({ where: { recipeId: id } });

    // Rezept selbst löschen
    await prisma.recipe.delete({
      where: { id: id }
    });

    return { success: true, message: "Rezept erfolgreich gelöscht" };
  } catch (error) {
    request.log.error(error);
    reply.code(500).send({ error: "Fehler beim Löschen des Rezepts" });
  }
});

// Server starten
const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: '0.0.0.0' });
    console.log('🚀 Guerilla Backend läuft auf http://localhost:4000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();