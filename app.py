import os
import pandas as pd
from flask import Flask, render_template, send_file

def create_app() -> Flask:
    # Configure Flask to search templates in the root directory
    # and serve static files from 'assets' matching the '/assets' URL path
    app = Flask(__name__, template_folder='.', static_folder='assets', static_url_path='/assets')

    @app.get("/")
    @app.get("/index.html")
    def index():
        return render_template("index.html")

    @app.get("/dataset")
    @app.get("/dataset.html")
    def dataset():
        enriched_path = os.path.join(app.root_path, "data", "food_orders_enriched.csv")
        base_path = os.path.join(app.root_path, "data", "food_orders.csv")

        path = enriched_path if os.path.exists(enriched_path) else base_path
        df_preview = None
        has_file = os.path.exists(path)
        
        if has_file:
            try:
                df = pd.read_csv(path)
                # Take top 20 rows for preview representation
                df_preview = df.head(20).to_dict(orient="records")
            except Exception as e:
                print(f"Error loading preview dataset: {e}")

        return render_template("dataset.html", preview=df_preview, has_file=has_file)

    @app.get("/download")
    def download_dataset():
        enriched_path = os.path.join(app.root_path, "data", "food_orders_enriched.csv")
        base_path = os.path.join(app.root_path, "data", "food_orders.csv")
        path = enriched_path if os.path.exists(enriched_path) else base_path

        if not os.path.exists(path):
            return ("Dataset file not found in 'data/' folder. Please ensure the CSV is generated or placed there.", 404)

        return send_file(path, as_attachment=True, download_name=os.path.basename(path))

    @app.get("/dashboard")
    @app.get("/dashboard.html")
    def dashboard():
        return render_template("dashboard.html")

    @app.get("/story")
    @app.get("/story.html")
    def story():
        return render_template("story.html")

    @app.get("/about")
    @app.get("/about.html")
    @app.get("/insights")
    def about():
        return render_template("about.html")

    return app