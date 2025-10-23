pipeline {
  agent any
  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '15'))
    timeout(time: 25, unit: 'MINUTES')
  }

  environment {
    APP_DIR  = '/var/www/agora/dev'
    SERVICE  = 'agora-dev'
    ENV_FILE = '/etc/market/agora.env'
  }

  stages {

    stage('Node & pnpm') {
      steps {
        sh '''
          # Usar npx para ejecutar pnpm sin instalación global
          node -v || true
          npx pnpm@latest --version
        '''
      }
    }

    stage('Install deps') {
      steps {
        sh '''
          # Instala con lockfile (pnpm-lock.yaml)
          npx pnpm@latest install --frozen-lockfile
        '''
      }
    }

    stage('Setup environment') {
      steps {
        sh '''
          # Crear archivo .env desde .env.example
          if [ -f .env.example ]; then
            cp .env.example .env
            echo "✅ Archivo .env creado desde .env.example"
          else
            echo "⚠️  Archivo .env.example no encontrado"
            touch .env
          fi
        '''
      }
    }

    stage('GraphQL codegen') {
      steps {
        sh 'npx pnpm@latest generate'
      }
    }

    stage('Build') {
      steps {
        sh '''
          # Exporta variables para embebido en build (NEXT_PUBLIC_*)
          set -a
          if [ -f ''' + env.ENV_FILE + ''' ]; then
            . ''' + env.ENV_FILE + '''
            echo "✅ Variables cargadas desde ''' + env.ENV_FILE + '''"
          else
            echo "❌ Archivo ''' + env.ENV_FILE + ''' no encontrado"
            echo "Por favor crea el archivo con:"
            echo "sudo mkdir -p /etc/market"
            echo "sudo touch /etc/market/agora.env"
            echo "sudo chown jenkins:jenkins /etc/market/agora.env"
            echo "Luego agrega las variables necesarias al archivo"
            exit 1
          fi
          set +a

          # Asegura output standalone para despliegue limpio
          # (debe estar en next.config.js: output: "standalone")
          npx pnpm@latest build
        '''
      }
    }

        stage('Deploy (sync)') {
          steps {
            sh '''
              set -e
              # Detén el servicio antes de reemplazar (sin sudo)
              pkill -f "agora-dev" || true

              # Sincroniza el código generado y build al destino
              mkdir -p "''' + env.APP_DIR + '''"
              rsync -a --delete \
                --exclude='.git' \
                --exclude='node_modules' \
                ./ "''' + env.APP_DIR + '''/"

              # Instala deps de producción en runtime (sin husky)
              cd "''' + env.APP_DIR + '''"
              npx pnpm@latest install --frozen-lockfile --prod --ignore-scripts
            '''
          }
        }

        stage('Restart service') {
          steps {
            sh '''
              # Inicia la aplicación en background con puerto 5000
              cd "''' + env.APP_DIR + '''"
              PORT=5000 nohup npx pnpm@latest start > agora-dev.log 2>&1 &
              echo $! > agora-dev.pid
              sleep 5
              
              # Verifica que esté corriendo
              if [ -f agora-dev.pid ]; then
                echo "✅ Aplicación iniciada con PID: $(cat agora-dev.pid)"
                echo "📋 Verificando logs..."
                tail -n 10 agora-dev.log || true
              else
                echo "❌ Error al iniciar la aplicación"
                exit 1
              fi
            '''
          }
        }

        stage('Health check') {
          steps {
            sh '''
              for i in $(seq 1 20); do
                if curl -fsS http://127.0.0.1:5000/ >/dev/null; then
                  echo "✅ App respondió correctamente"
                  exit 0
                fi
                echo "⏳ Esperando app... (intento $i/20)"
                sleep 2
              done
              echo "❌ App no respondió después de 40 segundos"
              exit 1
            '''
          }
        }
  }

  post {
    success {
      echo "✅ Desplegado: http://54.83.250.117:5000"
    }
    failure {
      echo "❌ Falló el deploy. Revisa la consola."
    }
    always {
      cleanWs()
    }
  }
}
