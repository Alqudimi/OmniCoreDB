import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight, Circle, Pause, Play } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showControls?: boolean
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
  canScrollPrev: boolean
  canScrollNext: boolean
  selectedIndex: number
  scrollSnaps: number[]
  isPlaying: boolean
  toggleAutoplay: () => void
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      autoPlay = false,
      autoPlayInterval = 4000,
      showDots = true,
      showControls = true,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        loop: true,
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])
    const [isPlaying, setIsPlaying] = React.useState(autoPlay)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setSelectedIndex(api.selectedScrollSnap())
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const onInit = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }
      setScrollSnaps(api.scrollSnapList())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const scrollTo = React.useCallback(
      (index: number) => {
        api?.scrollTo(index)
      },
      [api]
    )

    const toggleAutoplay = React.useCallback(() => {
      setIsPlaying((prev) => !prev)
    }, [])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        } else if (event.key === " ") {
          event.preventDefault()
          toggleAutoplay()
        }
      },
      [scrollPrev, scrollNext, toggleAutoplay]
    )

    // AutoPlay functionality
    React.useEffect(() => {
      if (!api || !isPlaying) return

      const interval = setInterval(() => {
        if (api.canScrollNext()) {
          scrollNext()
        } else {
          api.scrollTo(0)
        }
      }, autoPlayInterval)

      return () => clearInterval(interval)
    }, [api, isPlaying, scrollNext, autoPlayInterval])

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }
      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onInit(api)
      onSelect(api)
      api.on("reInit", onInit)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
        api?.off("reInit", onInit)
        api?.off("reInit", onSelect)
      }
    }, [api, onSelect, onInit])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          scrollTo,
          canScrollPrev,
          canScrollNext,
          selectedIndex,
          scrollSnaps,
          isPlaying,
          toggleAutoplay,
          autoPlay,
          showDots,
          showControls,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn(
            "relative group",
            "transition-all duration-300 ease-in-out",
            className
          )}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div 
      ref={carouselRef} 
      className={cn(
        "overflow-hidden",
        "rounded-2xl",
        "shadow-2xl",
        "transition-all duration-500 ease-out"
      )}
    >
      <div
        ref={ref}
        className={cn(
          "flex backface-hidden",
          "transition-transform duration-500 ease-out",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        "transform-gpu transition-all duration-500 ease-out",
        "hover:scale-[1.02] active:scale-100",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    showOnHover?: boolean
  }
>(({ className, variant = "outline", size = "icon", showOnHover = false, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-12 w-12 rounded-full shadow-2xl border-2 border-white/20 bg-background/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out transform",
        "hover:scale-110 hover:bg-background hover:shadow-3xl active:scale-95",
        "focus:ring-2 focus:ring-primary focus:ring-offset-2",
        showOnHover && "opacity-0 group-hover:opacity-100",
        orientation === "horizontal"
          ? "-left-6 top-1/2 -translate-y-1/2 md:-left-8"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        !canScrollPrev && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-6 w-6" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    showOnHover?: boolean
  }
>(({ className, variant = "outline", size = "icon", showOnHover = false, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-12 w-12 rounded-full shadow-2xl border-2 border-white/20 bg-background/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out transform",
        "hover:scale-110 hover:bg-background hover:shadow-3xl active:scale-95",
        "focus:ring-2 focus:ring-primary focus:ring-offset-2",
        showOnHover && "opacity-0 group-hover:opacity-100",
        orientation === "horizontal"
          ? "-right-6 top-1/2 -translate-y-1/2 md:-right-8"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        !canScrollNext && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-6 w-6" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

const CarouselDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, scrollTo, orientation } = useCarousel()

  if (scrollSnaps.length <= 1) return null

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-2 mt-6",
        orientation === "vertical" && "flex-col",
        className
      )}
      {...props}
    >
      {scrollSnaps.map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="icon"
          className={cn(
            "h-3 w-3 rounded-full p-0 transition-all duration-300 ease-out",
            "hover:scale-125 hover:bg-primary/80",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2",
            selectedIndex === index
              ? "bg-primary scale-125 shadow-lg"
              : "bg-muted-foreground/30 scale-100"
          )}
          onClick={() => scrollTo(index)}
          aria-label={`Go to slide ${index + 1}`}
        >
          <span className="sr-only">Slide {index + 1}</span>
        </Button>
      ))}
    </div>
  )
})
CarouselDots.displayName = "CarouselDots"

const CarouselAutoplayToggle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { isPlaying, toggleAutoplay } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute bottom-4 right-4 h-10 w-10 rounded-full shadow-lg bg-background/80 backdrop-blur-sm",
        "transition-all duration-300 ease-out transform",
        "hover:scale-110 hover:shadow-xl active:scale-95",
        "focus:ring-2 focus:ring-primary focus:ring-offset-2",
        className
      )}
      onClick={toggleAutoplay}
      {...props}
    >
      {isPlaying ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Play className="h-5 w-5" />
      )}
      <span className="sr-only">
        {isPlaying ? "Pause autoplay" : "Start autoplay"}
      </span>
    </Button>
  )
})
CarouselAutoplayToggle.displayName = "CarouselAutoplayToggle"

const CarouselProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    showTime?: boolean
  }
>(({ className, showTime = false, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, autoPlayInterval, isPlaying } = useCarousel()
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (!isPlaying) {
      setProgress(0)
      return
    }

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / autoPlayInterval) * 100
      setProgress(Math.min(newProgress, 100))

      if (newProgress >= 100) {
        setProgress(0)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [selectedIndex, isPlaying, autoPlayInterval])

  if (scrollSnaps.length <= 1) return null

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 mt-4", className)}
      {...props}
    >
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-50 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showTime && (
        <span className="text-xs text-muted-foreground font-mono min-w-[50px]">
          {selectedIndex + 1}/{scrollSnaps.length}
        </span>
      )}
    </div>
  )
})
CarouselProgress.displayName = "CarouselProgress"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselAutoplayToggle,
  CarouselProgress,
}