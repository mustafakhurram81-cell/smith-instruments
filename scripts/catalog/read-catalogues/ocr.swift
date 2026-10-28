// Reads the text on page images with macOS's built-in text recognition (Vision).
// Build: swiftc -O ocr.swift -o ocr     Use: ./ocr page1.png page2.png ...
// Prints one JSON line per image: {"file", "lines": [{"t": text, "x", "y", "w", "h"}]}, positions 0-1 from the top left.
import Foundation
import Vision
import AppKit

for path in CommandLine.arguments.dropFirst() {
    guard let img = NSImage(contentsOfFile: path),
          let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.usesLanguageCorrection = false  // codes like 02-282-45 are not words
    req.recognitionLanguages = ["en-US"]
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    var lines: [[String: Any]] = []
    for o in req.results ?? [] {
        guard let c = o.topCandidates(1).first else { continue }
        let b = o.boundingBox
        lines.append(["t": c.string, "x": b.minX, "y": 1 - b.maxY, "w": b.width, "h": b.height])
    }
    let obj: [String: Any] = ["file": path, "lines": lines]
    if let d = try? JSONSerialization.data(withJSONObject: obj), let s = String(data: d, encoding: .utf8) { print(s) }
}
