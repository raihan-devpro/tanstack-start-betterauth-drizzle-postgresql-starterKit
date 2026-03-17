


class SeedController {
  private running = false
  private stopRequested = false

  async start() {
    if (this.running) {
      console.log("⚠️ Seed already running")
      return
    }

    this.running = true
    this.stopRequested = false

    console.log("🌱 Seed started")

    try {
      // todo: implement seed
      await console.log("🌱 Seed started:",this.running,this.stopRequested)
      // await seed(() => this.stopRequested)
    }catch (error) {
      console.error("❌ Seed failed", error)
    }

    finally {
      this.running = false
      console.log("✅ Seed finished")
    }
  }

  stop() {
    if (!this.running) return
    console.log("🛑 Stop requested")
    this.stopRequested = true
  }

  isRunning() {
    return this.running
  }
}

export const seedController = new SeedController()
