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
          # Copiar configuración desde agora.env (fuente única de verdad)
          if [ -f ''' + env.ENV_FILE + ''' ]; then
            cp ''' + env.ENV_FILE + ''' .env
            echo "✅ Archivo .env creado desde ''' + env.ENV_FILE + '''"
          else
            echo "❌ Archivo ''' + env.ENV_FILE + ''' no encontrado"
            echo "Por favor crea el archivo con:"
            echo "sudo mkdir -p /etc/market"
            echo "sudo touch /etc/market/agora.env"
            echo "sudo chown jenkins:jenkins /etc/market/agora.env"
            echo "Luego agrega las variables necesarias al archivo"
            exit 1
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
          # Verificar que .env existe (ya copiado en Setup environment)
          if [ ! -f .env ]; then
            echo "❌ Archivo .env no encontrado. Debe haberse creado en el stage anterior."
            exit 1
          fi
          
          # Exporta variables para embebido en build (NEXT_PUBLIC_*)
          # Las variables ya están en .env, pero las exportamos también al entorno
          set -a
          . .env
          set +a
          echo "✅ Variables cargadas desde .env (copiado desde ''' + env.ENV_FILE + ''')"

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
              # Detén el servicio antes de reemplazar (más agresivo)
              pkill -f "agora-dev" || true
              pkill -f "pnpm.*start" || true
              pkill -f "next.*start" || true
              
              # Esperar a que se libere el puerto
              sleep 3

              # Sincroniza el código generado y build al destino
              mkdir -p "''' + env.APP_DIR + '''"
              rsync -a --delete \
                --exclude='.git' \
                --exclude='node_modules' \
                ./ "''' + env.APP_DIR + '''/"

              # Asegurar que .env en destino viene de la fuente única (agora.env)
              cd "''' + env.APP_DIR + '''"
              if [ -f ''' + env.ENV_FILE + ''' ]; then
                cp ''' + env.ENV_FILE + ''' .env
                echo "✅ .env actualizado desde ''' + env.ENV_FILE + ''' en destino"
              else
                echo "⚠️  ''' + env.ENV_FILE + ''' no encontrado, usando .env del workspace"
              fi

              # Instala deps de producción en runtime (sin husky)
              npx pnpm@latest install --frozen-lockfile --prod --ignore-scripts
            '''
          }
        }

        stage('Restart service') {
          steps {
            sh '''
              cd "''' + env.APP_DIR + '''"
              
              # Detener procesos existentes de manera más agresiva
              echo "🛑 Deteniendo procesos existentes..."
              pkill -f "agora-dev" || true
              pkill -f "pnpm.*start" || true
              pkill -f "next.*start" || true
              
              # Si hay un PID guardado, intentar matarlo
              if [ -f agora-dev.pid ]; then
                OLD_PID=$(cat agora-dev.pid)
                if kill -0 "$OLD_PID" 2>/dev/null; then
                  echo "🛑 Matando proceso anterior con PID: $OLD_PID"
                  kill -9 "$OLD_PID" 2>/dev/null || true
                fi
                rm -f agora-dev.pid
              fi
              
              # Esperar a que el puerto se libere
              echo "⏳ Esperando a que el puerto 5010 se libere..."
              for i in $(seq 1 10); do
                if ! netstat -tlnp 2>/dev/null | grep :5010 >/dev/null; then
                  break
                fi
                echo "   Intento $i/10: puerto aún ocupado..."
                sleep 2
              done
              
              # Verificar una última vez
              if netstat -tlnp 2>/dev/null | grep :5010 >/dev/null; then
                echo "⚠️ Puerto 5010 aún ocupado, intentando liberar con fuser..."
                fuser -k 5010/tcp 2>/dev/null || true
                sleep 3
              fi
              
              # Inicia la aplicación en background con puerto 5010
              echo "🚀 Iniciando aplicación..."
              export PORT=5010
              nohup npx pnpm@latest start > agora-dev.log 2>&1 &
              APP_PID=$!
              echo $APP_PID > agora-dev.pid
              sleep 5
              
              # Verifica que esté corriendo
              if [ -f agora-dev.pid ]; then
                PID=$(cat agora-dev.pid)
                if kill -0 "$PID" 2>/dev/null; then
                  echo "✅ Aplicación iniciada con PID: $PID"
                  echo "📋 Verificando logs..."
                  tail -n 20 agora-dev.log || true
                else
                  echo "❌ El proceso no está corriendo"
                  echo "📋 Últimos logs:"
                  tail -n 50 agora-dev.log || true
                  exit 1
                fi
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
                if curl -fsS http://127.0.0.1:5010/ >/dev/null; then
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
      echo "✅ Desplegado: http://54.83.250.117:5010"
    }
    failure {
      echo "❌ Falló el deploy. Revisa la consola."
    }
    always {
      cleanWs()
    }
  }
}
