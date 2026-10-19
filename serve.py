import http.server
import socketserver
import webbrowser

PORT = 3000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    webbrowser.open(f"http://localhost:{PORT}")
    httpd.serve_forever()
