
nums = Files.readlines_as_numbers("input")

# need to use Enum.to_list here, else I get:
# ** (ArgumentError) cannot cycle over empty enumerable
inf = Stream.cycle(nums |> Enum.to_list)

# Accumulate the sum of elements (frequencies)
accumulated = inf |> Stream.transform(0, fn i, acc -> {[acc], acc + i} end)

# Stop the stream as soon as we find the first duplicate number. We use a transform
# for this, with a MapSet as the accumulator. We don't halt when we see the first
# duplicate, because then it won't be emitted. Instead we do one more "round" so that
# the final stream ends with the first duplicate number.
until_dup = accumulated |> Stream.transform(MapSet.new(), fn i, set ->
  cond do
    set === :halt ->
      {:halt, nil}
    MapSet.member?(set, i) ->
      # we want this element, so don't halt yet.
      # pass :halt as acc to halt next round.
      {[i], :halt}
    true ->
      {[i], MapSet.put(set, i)}
  end
end)

# Enum.take with negative number takes from the end
first_dup = Enum.take(until_dup, -1)

# Print the head of the result (which is a list of 1 element)
IO.inspect hd first_dup
