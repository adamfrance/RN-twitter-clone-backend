import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

//Tweet CRUD

//Create tweet
router.post("/", async (req, res) => {
  const { content, image } = req.body;
  // @ts-ignore
  const user = req.user;
  res.sendStatus(200);
  try {
    const result = await prisma.tweet.create({
      data: {
        content,
        image,
        userId: user.id,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: "Cannot create the tweet" });
  }
});

//list tweets
router.get("/", async (req, res) => {
  try {
    const allTweets = await prisma.tweet.findMany({
      include: {
        user: { select: { id: true, name: true, username: true, image: true } },
      },
    });
    res.json(allTweets);
  } catch (error) {}
  res.status(400).json({ error: "Cannot list all tweets" });
});

//Get one tweet
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const tweet = await prisma.tweet.findUnique({
      where: { id: Number(id) },
      include: { user: true },
    });
    if (!tweet) {
      return res.status(404).json({ error: "Tweet Not Found" });
    }
    return res.json(tweet);
  } catch (error) {
    res.status(400).json({ error: `Cannot get the tweet with the id: ${id}` });
  }

  res.status(501).json({ error: `Not implemented: ${id}` });
});

//update tweet
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.status(501).json({ error: `Not implemented: ${id}` });
});

//delete tweet
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tweet.delete({ where: { id: Number(id) } });
  } catch (error) {}
  res.status(501).json({ error: `Tweet with id ${id} not found` });
});

export default router;
