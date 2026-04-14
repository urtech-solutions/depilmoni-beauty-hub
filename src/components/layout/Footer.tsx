import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-border bg-secondary/30 py-12 mt-20">
    <div className="container grid gap-8 md:grid-cols-4">
      <div>
        <span className="font-display text-xl font-bold text-gradient-gold">Depilmoni</span>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Produtos premium para depilação e cuidados com a pele. Qualidade profissional ao seu alcance.
        </p>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Loja</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/produtos" className="hover:text-foreground transition-colors">Produtos</Link></li>
          <li><Link to="/kits" className="hover:text-foreground transition-colors">Kits</Link></li>
          <li><Link to="/eventos" className="hover:text-foreground transition-colors">Eventos</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Conta</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/minha-conta" className="hover:text-foreground transition-colors">Minha Conta</Link></li>
          <li><Link to="/carrinho" className="hover:text-foreground transition-colors">Carrinho</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display font-semibold mb-3">Atendimento</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>contato@depilmoni.com.br</li>
          <li>(11) 99999-0000</li>
        </ul>
      </div>
    </div>
    <div className="container mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Depilmoni. Todos os direitos reservados.
    </div>
  </footer>
);

export default Footer;
