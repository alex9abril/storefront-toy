pipeline {
  agent any
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 25, unit: 'MINUTES')
  }

  environment {
    APP_DIR  = '/var/www/agora/dev'
    SERVICE  = 'agora-dev'`
    ENV_FILE = '/etc/market/agora.env'
  }

  stages {

    stage('Node & pnpm') {
      steps {
        sh '''
          # Instalar pnpm globalmente sin corepack
          node -v || true
          npm install -g pnpm@latest
          pnpm -v
        '''
      }
    }

    stage('Install deps') {
      steps {
        sh '''
          # Instala con lockfile (pnpm-lock.yaml)
          pnpm install --frozen-lockfile
        '''
      }
    }

    stage('GraphQL codegen') {
      steps {
        sh 'pnpm generate'
      }
    }

    stage('Build') {
      steps {
        sh '''
          # Exporta variables para embebido en build (NEXT_PUBLIC_*)
          set -a
          . ''' + env.ENV_FILE + '''
          set +a

          # Asegura output standalone para despliegue limpio
          # (debe estar en next.config.js: output: "standalone")
          pnpm build
        '''
      }
    }

    stage('Deploy (sync)') {
      steps {
        sh '''
          set -e
          # Detén el servicio antes de reemplazar
          sudo systemctl stop ''' + env.SERVICE + ''' || true

          # Sincroniza el código generado y build al destino
          sudo mkdir -p "''' + env.APP_DIR + '''"
          rsync -a --delete \
            --exclude='.git' \
            --exclude='node_modules' \
            ./ "''' + env.APP_DIR + '''/"

          # Instala deps de producción en runtime
          cd "''' + env.APP_DIR + '''"
          pnpm install --frozen-lockfile --prod

          # Propietarios correctos
          sudo chown -R jenkins:jenkins "''' + env.APP_DIR + '''"
        '''
      }
    }

    stage('Restart service') {
      steps {
        sh '''
          sudo systemctl daemon-reload
          sudo systemctl restart ''' + env.SERVICE + '''
          sleep 3
          sudo systemctl status ''' + env.SERVICE + ''' --no-pager || true
        '''
      }
    }

    stage('Health check') {
      steps {
        sh '''
          for i in $(seq 1 20); do
            if curl -fsS http://127.0.0.1:3000/ >/dev/null; then
              echo "OK"
              exit 0
            fi
            echo "Waiting app..."
            sleep 2
          done
          echo "App no respondió"
          exit 1
        '''
      }
    }
  }

  post {
    success {
      echo "✅ Desplegado: http://54.83.250.117:3000"
    }
    failure {
      echo "❌ Falló el deploy. Revisa la consola."
    }
    always {
      cleanWs()
    }
  }
}
