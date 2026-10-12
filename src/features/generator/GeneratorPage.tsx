import { Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../shared/ui/Toast";
import { copyText } from "../../shared/clipboard";
import { StrengthMeter } from "../../shared/ui/StrengthMeter";
import { generatePassphrase, generatePassword } from "../../lib/passwordGenerator";
import type { PasswordOptions } from "../../lib/passwordGenerator";

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 16,
  upper: true,
  lower: true,
  numbers: true,
  symbols: true,
  avoidAmbiguous: true
};

export function GeneratorPage() {
  const [passphrase, setPassphrase] = useState(false);
  const [options, setOptions] = useState<PasswordOptions>(DEFAULT_OPTIONS);
  const [wordCount, setWordCount] = useState(4);
  const [result, setResult] = useState("");
  const [generated, setGenerated] = useState(false);
  const toast = useToast();

  function setOption<K extends keyof PasswordOptions>(key: K, value: PasswordOptions[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function generate() {
    if (passphrase) {
      setResult(generatePassphrase(wordCount));
    } else {
      setResult(generatePassword(options));
    }
    setGenerated(true);
  }

  async function copyResult() {
    if (!result) return;
    await copyText(result);
    toast({ message: "Password copied to clipboard", tone: "success" });
  }

  return (
    <section className="generator-page">
      <div className="page-header">
        <div>
          <h2>Password Generator</h2>
          <p className="page-count">Create strong, random passwords and passphrases.</p>
        </div>
      </div>

      <div className="panel generator-panel">
        <div className="mode-toggle">
          <button className={!passphrase ? "active" : ""} onClick={() => setPassphrase(false)}>Password</button>
          <button className={passphrase ? "active" : ""} onClick={() => setPassphrase(true)}>Passphrase</button>
        </div>

        <div className="generator-result">
          {result ? (
            <>
              <span className="mono">{result}</span>
              <div className="generator-actions">
                <button className="icon-button" onClick={copyResult} aria-label="Copy password"><Copy size={18} /></button>
                <button className="icon-button" onClick={generate} aria-label="Generate again"><RefreshCw size={18} /></button>
              </div>
            </>
          ) : (
            <span className="muted">Press Generate to create a {passphrase ? "passphrase" : "password"}.</span>
          )}
        </div>
        <StrengthMeter password={generated ? result : ""} label={generated} />
        <button className="primary-button generator-generate" onClick={generate}>Generate</button>

        {passphrase ? (
          <label className="form-field">
            <span>Number of words</span>
            <div className="range-row">
              <input type="range" min={3} max={8} value={wordCount} onChange={(e) => setWordCount(Number(e.target.value))} />
              <span className="muted">{wordCount}</span>
            </div>
          </label>
        ) : (
          <div className="generator-controls">
            <label className="form-field">
              <span>Length: {options.length}</span>
              <input type="range" min={4} max={64} value={options.length} onChange={(e) => setOption("length", Number(e.target.value))} />
            </label>
            <div className="check-grid">
              {([
                ["upper", "Uppercase"],
                ["lower", "Lowercase"],
                ["numbers", "Numbers"],
                ["symbols", "Symbols"]
              ] as const).map(([key, label]) => (
                <label key={key} className="check-row">
                  <input type="checkbox" checked={options[key]} onChange={(e) => setOption(key, e.target.checked)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <label className="check-row">
              <input type="checkbox" checked={options.avoidAmbiguous} onChange={(e) => setOption("avoidAmbiguous", e.target.checked)} />
              <span>Avoid ambiguous characters</span>
            </label>
          </div>
        )}
      </div>
    </section>
  );
}