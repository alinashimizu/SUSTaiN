import tkinter as tk
from tkinter import messagebox

def rate_prompt():
    """Rate the user's prompt."""
    user_input = input_text.get("1.0", "end-1c").strip()
    if not user_input:
        messagebox.showwarning("Warning", "Please enter some text!")
        return
    
    # implement logic to calculate the rating.
    # return a random placeholder rating
    rating = f"Your prompt rating is: {len(user_input) % 10}/10"
    result_label.config(text=rating)

# Main function to display the GUI
def create_gui():
    root = tk.Tk()
    root.title("Prompt Efficiency Rater")
    
    # input text box
    tk.Label(root, text="Enter your prompt:").pack(pady=5)
    global input_text
    input_text = tk.Text(root, height=5, width=50)
    input_text.pack(pady=5)
    
    # rate button
    rate_button = tk.Button(root, text="Rate Prompt", command=rate_prompt)
    rate_button.pack(pady=10)
    
    # result label
    global result_label
    result_label = tk.Label(root, text="", fg="blue", font=("Arial", 12))
    result_label.pack(pady=5)
    
    # start main loop
    root.mainloop()
