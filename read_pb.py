pb_path = "/Users/shubhanyways_/.gemini/antigravity/conversations/dcaa5a61-6405-4616-a275-54bed5100219.pb"

with open(pb_path, "rb") as f:
    data = f.read(100)

print("First 100 bytes of pb file:")
print(data.hex())
print(list(data[:20]))
