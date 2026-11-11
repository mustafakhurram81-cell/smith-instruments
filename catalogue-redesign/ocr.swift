import Foundation
import Vision
import AppKit
// Prints each line of text found in an image, top to bottom: "y<TAB>x<TAB>height<TAB>text"
let url = URL(fileURLWithPath: CommandLine.arguments[1])
guard let img = NSImage(contentsOf: url), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { exit(1) }
let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = false
req.recognitionLanguages = ["en-US", "de-DE", "pt-BR", "es-ES"]
try VNImageRequestHandler(cgImage: cg).perform([req])
for o in (req.results ?? []).sorted(by: { $0.boundingBox.maxY > $1.boundingBox.maxY }) {
  if let t = o.topCandidates(1).first {
    print(String(format: "%.3f\t%.3f\t%.3f\t%@", 1 - o.boundingBox.maxY, o.boundingBox.minX, o.boundingBox.height, t.string))
  }
}
