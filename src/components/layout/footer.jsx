export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            &copy; 2025 Certify. All Rights Reserved.
          </div>
          <div className="flex space-x-6 text-sm font-medium">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}