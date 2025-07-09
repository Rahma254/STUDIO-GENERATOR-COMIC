import { useState } from 'react';
// Import komponen UI yang sudah dibuat
import CharacterSetup from '../components/CharacterSetup';
import PanelGenerator from '../components/PanelGenerator';
import ComicStrip from '../components/ComicStrip';

export default function Home() {
  const [characterInfo, setCharacterInfo] = useState({ photo: null, trigger: '' });
  const [comicPanels, setComicPanels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (storyPrompt, dialog) => {
    if (!characterInfo.trigger) {
      alert("Please define your character trigger word first!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger: characterInfo.trigger,
          prompt: storyPrompt,
          dialog: dialog,
          style: "Anime 90s style", // Ambil dari state dropdown nantinya
        }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        setComicPanels([...comicPanels, data.imageUrl]);
      } else {
        throw new Error(data.error || "Failed to generate panel.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fungsi untuk download
  const handleDownload = () => {
    // Logika untuk menggabungkan gambar di comicPanels (bisa pakai canvas) dan men-downloadnya.
    console.log("Downloading comic..."); 
  }

  return (
    <div className="studio-container"> {/* Pakai styling dari globals.css */}
      <header>
        <h1>Nabila Ahmad Studio Development AI</h1>
        <button onClick={handleDownload} disabled={comicPanels.length === 0}>Download Comic</button>
      </header>
      
      <main>
        <CharacterSetup onUpdate={setCharacterInfo} />
        <PanelGenerator onGenerate={handleGenerate} isLoading={isLoading} />
      </main>
      
      <ComicStrip panels={comicPanels} />
    </div>
  );
}
