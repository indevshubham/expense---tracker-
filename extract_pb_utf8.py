import re
import os

pb_path = "/Users/shubhanyways_/.gemini/antigravity/conversations/dcaa5a61-6405-4616-a275-54bed5100219.pb"

with open(pb_path, "rb") as f:
    content_bytes = f.read()

# Let's decode the entire protobuf file as utf-8, ignoring errors
content = content_bytes.decode('utf-8', errors='ignore')
print(f"Decoded pb content: {len(content)} chars.")

# We want to find the first time each of our target files was loaded.
# When the tool view_file was called, its result was returned to the system.
# The result has the structure: "File Path: `file:///...`\nTotal Lines: ...\n"
# Or it has line numbers: "1: ..."
# Let's search for "File Path:" or the filename or "DashboardPage.tsx" in the decoded string.

# Let's search for "File Path: " matches in the decoded content
pattern = r"File Path:\s*`file://([^`]+)`"
matches = list(re.finditer(pattern, content))
print(f"Found {len(matches)} file path references:")

for m in matches:
    start = m.start()
    fpath = m.group(1)
    # Let's print around the match to see the context
    context = content[start:start+300]
    print(f"- Path: {fpath} at index {start}")

# Let's save all contiguous text segments that contain "File Path:" followed by a lot of text.
# The file content usually is a big block of text with lines starting with line numbers "1: ", "2: ", "3: " etc.,
# or raw file contents without line numbers.
# Let's write a parser that extracts these blocks.
output_dir = "/Users/shubhanyways_/Documents/Startupp_/extracted_original"
os.makedirs(output_dir, exist_ok=True)

for i, m in enumerate(matches):
    start = m.start()
    fpath = m.group(1)
    # Let's extract up to 100,000 characters from this match
    sub = content[start:start+120000]
    # Let's find the end of the block. A block of view_file might end with something else,
    # or another tool call, or a step delimiter.
    # Let's see if we can find where the code lines end.
    # If the lines have line numbers like "1: ", "2: " ... we can parse them.
    # Let's print the first 200 characters of this segment to see if it's indeed the file content.
    print(f"\n--- MATCH {i} ({os.path.basename(fpath)}) ---")
    print(sub[:400])
    
    # Save the raw block
    safe_name = os.path.basename(fpath).replace(".", "_") + f"_{i}.txt"
    with open(os.path.join(output_dir, safe_name), "w", encoding="utf-8") as out:
        out.write(sub)
