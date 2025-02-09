import tkinter as tk
from token_convertor import estimate_water_usage


def calculate_and_display():
    """Fetches user input, calculates water usage, and displays it inside the window."""
    user_prompt = entry.get("1.0", tk.END).strip()
    if not user_prompt:
        result_label.config(text="⚠️ Please enter a prompt.", fg="red")
        return

    # Compute water usage
    result = estimate_water_usage(user_prompt)

    # Display result inside the window
    result_label.config(text=f"💧 Estimated Water Used: {result}", fg="blue")

# GUI Setup
root = tk.Tk()
root.title("AI Prompt Water Consumption")

# Instruction Label
label = tk.Label(root, text="Enter your AI prompt:", font=("Arial", 12))
label.pack(pady=5)

# Text Entry Box
entry = tk.Text(root, height=5, width=50, font=("Arial", 12))
entry.pack(pady=5)

# Label for live result (starts empty)
result_label = tk.Label(root, text="", font=("Arial", 12))
result_label.pack(pady=10)

# Submit Button
button = tk.Button(root, text="Calculate Water Usage", command=calculate_and_display)
button.pack(pady=5)

# Run GUI
root.mainloop()
