import tiktoken

def estimate_water_usage(prompt):
    """Estimate water consumption based on the number of tokens in a prompt."""
    
    # Load OpenAI tokenizer (you can replace it with another method if needed)
    enc = tiktoken.get_encoding("cl100k_base")  # GPT-4 / GPT-3.5 tokenizer
    num_tokens = len(enc.encode(prompt))

    # Assumed water consumption per token (mL)
    water_per_token = 0.003  # Mid-range estimate
    water_usage_mL = num_tokens * water_per_token

    # Convert to human-friendly comparisons
    if water_usage_mL < 5:
        equivalent = "a sip of water 💧"
    elif water_usage_mL < 250:
        equivalent = f"a glass of water (~{water_usage_mL:.1f}mL) 🥛"
    elif water_usage_mL < 1000:
        equivalent = f"a water bottle (~{water_usage_mL:.1f}mL) 🚰"
    else:
        equivalent = f"a shower's worth of water (~{water_usage_mL / 12:.1f}L) 🚿"

    return f"Your prompt used ~{water_usage_mL:.2f}mL of water, close to {equivalent}."

