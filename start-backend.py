#!/usr/bin/env python3
"""
Script para iniciar o servidor backend Flask para BRfix
Para usar: python start-backend.py
"""

import subprocess
import sys
import os

def main():
    # Verifica se está na pasta correta
    if not os.path.exists('backend/app.py'):
        print("❌ Erro: Execute este script na raiz do projeto!")
        print("   Certifique-se de que existe a pasta 'backend/' com o arquivo 'app.py'")
        return 1
    
    # Muda para a pasta backend
    os.chdir('backend')
    
    # Instala dependências se necessário
    if not os.path.exists('venv'):
        print("📦 Instalando dependências...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
    
    # Inicia o servidor
    print("🚀 Iniciando servidor backend na porta 5000...")
    print("📧 Servidor de email configurado para: contact@davensolutions.com")
    print("🌐 Frontend deve apontar para: http://localhost:5000/send-email")
    print("─" * 60)
    
    try:
        subprocess.run([sys.executable, 'app.py'])
    except KeyboardInterrupt:
        print("\n✅ Servidor encerrado pelo usuário")
    
    return 0

if __name__ == "__main__":
    exit(main())