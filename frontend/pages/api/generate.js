// File: pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Ambil data dari body request frontend
  const { trigger, prompt, dialog, style } = req.body;

  // **PENTING**: Gunakan nama variabel yang sama dengan yang ada di Vercel
  const AI_API_KEY = process.env.OPENAI_API_KEY;

  if (!AI_API_KEY) {
    console.error('OpenAI API key is not configured.');
    return res.status(500).json({ error: 'AI API key is not configured on the server.' });
  }

  // Buat prompt yang detail untuk AI
  const finalPrompt = `A single comic book panel, in a ${style}. A character known as ${trigger}. The scene is: ${prompt}. Include a speech bubble with the text: "${dialog}". Make it cinematic and high quality.`;

  try {
    // Panggil API OpenAI DALL-E 3
    const aiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd", // Tambahan: minta kualitas HD untuk hasil lebih baik
      }),
    });

    // Error handling jika OpenAI gagal
    if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        console.error('OpenAI API Error:', errorData);
        // Teruskan pesan error dari OpenAI jika ada
        const errorMessage = errorData.error?.message || 'Failed to get a response from the AI.';
        throw new Error(errorMessage);
    }

    const aiData = await aiResponse.json();
    const imageUrl = aiData.data[0].url;

    // Kirim URL gambar kembali ke frontend
    res.status(200).json({ imageUrl: imageUrl });

  } catch (error) {
    console.error('Internal Server Error:', error.message);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
}
