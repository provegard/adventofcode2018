
nums = Files.readlines_as_numbers("input")

# need to use Enum.to_list here, else I get:
# ** (ArgumentError) cannot cycle over empty enumerable
inf = Stream.cycle(nums |> Enum.to_list)

accumulated = inf |> Stream.transform(0, fn i, acc -> {[acc], acc + i} end)
until_dup = accumulated |> Stream.transform(MapSet.new(), fn i, set ->
  if set === :halt do
    {:halt, nil}
  else
    if MapSet.member?(set, i) do
      # we want this element, so don't halt yet.
      # pass :halt as acc to halt next round.
      {[i], :halt}
    else
      {[i], MapSet.put(set, i)}
    end
  end
end)

first_dup = Enum.take(until_dup, -1)
IO.inspect hd first_dup
