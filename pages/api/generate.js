import { data } from 'autoprefixer';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

export default async function handler(req, res) {
  const { prompt, size } = req.body;
  if (!openai.apiKey) {
    return res.status(500).json({
      error: {
        message: 'api key missing!',
      },
    });
  }

  if (prompt.trim().length === 0 || size.trim().length === 0) {
    return res.status(400).json({
      error: {
        message: 'prompt or image size missing',
      },
    });
  }

  try {
    let response = await openai.images.generate({
      prompt,
      n: 5,
      size,
      user: 'd3v310p3r',
    });
    return res.send({ data: response.data });
  } catch (error) {
    console.log('ERRROOOOOOOOOOR: ', error.message);
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
}
