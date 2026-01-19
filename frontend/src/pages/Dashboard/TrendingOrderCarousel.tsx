import { Carousel } from "@mantine/carousel";
import TrendingOrderCard, { Item } from "./TrendingOrderCard";

interface TrendingOrderCarouselProps {
  data: Item[];
}

export default function TrendingOrderCarousel({
  data,
}: TrendingOrderCarouselProps) {
  return (
    <Carousel
      mt={10}
      withIndicators
      height={300}
      includeGapInSize={true}
      slideGap="sm"
      slideSize={{ base: "50%", sm: "40%", lg: "30%" }}
      loop
    >
      {data?.map((trendingOrder: Item) => (
        <Carousel.Slide key={trendingOrder.id}>
          <TrendingOrderCard data={trendingOrder} />
        </Carousel.Slide>
      ))}
    </Carousel>
  );
}
