defmodule Day5 do

  def part1(polymer) do
    String.length(part1_str(polymer))
  end

  def part1_str(polymer) do
    chlist = String.to_charlist(polymer)
    new_chlist = react(chlist)
    to_string(new_chlist)
  end

  defp react(polymer) do
    regions = find_regions_to_delete(polymer)
    if length(regions) == 0 do
      # done
      polymer
    else
      # delete regions, starting with the last one
      new_polymer = regions
        |> Enum.reverse()
        |> Enum.reduce(polymer, fn {a, b}, poly ->
          region_length = b - a + 1
          {bef, aft} = Enum.split(poly, a)
          bef ++ Enum.drop(aft, region_length)
        end)
      react(new_polymer)
    end
  end

  defp different_polarity?(a, b) do
    a != b && same_letter_different_case(a, b)
  end

  defp same_letter_ignore_case(a, b) do
    a == b || same_letter_different_case(a, b)
  end

  defp same_letter_different_case(a, b) do
    if a > b, do: a - 32 == b, else: b - 32 == a
  end

  def find_regions_to_delete(polymer) do
    find_regions_to_delete_rec(polymer, 0, [], [])
  end

  defp find_regions_to_delete_rec(polymer, start_idx, stack, regions) do
    pair = polymer |> Enum.take(2)
    if (length(pair) < 2) do
      # nothing left, return the regions
      regions
    else
      [a, b] = pair
      rest = polymer |> Enum.drop(2)
      if different_polarity?(a, b) do
        # these can be removed! use the stack to find the entire region
        # then continue after the region
        # note: add 1 since that's half of our pair a+b
        half_region_size = 1 + length_of_different_polarity_prefix(stack, rest)
        # what are the endpoints of the region?
        # if region size is 2, then it's only a+b, so start is start_idx and end is (start_idx+2-1) (open end)
        # if region size is 4, then start is (start_idx-1)
        region_start_idx = start_idx + 1 - half_region_size
        region_end_idx = region_start_idx + (2 * half_region_size) - 1
        region = {region_start_idx, region_end_idx}
        # start after our region
        # use empty stack, since a subsequent region cannot overlap the one we just found
        next_start_idx = region_end_idx + 1
        new_polymer = rest |> Enum.drop(half_region_size - 1) # compensate for the 1 we added above
        find_regions_to_delete_rec(new_polymer, next_start_idx, [], regions ++ [region])
      else
        # these cannot be removed
        # jump one step forward (so that we start with b next iteration)
        new_stack = [a | stack]
        find_regions_to_delete_rec(tl(polymer), start_idx + 1, new_stack, regions)
      end
    end
  end

  defp length_of_different_polarity_prefix(stack, polymer) do
    Stream.zip(polymer, stack) |> Stream.take_while(fn {a, b} -> different_polarity?(a, b) end) |> Enum.count()
  end

  def part2(polymer) do
    chlist = String.to_charlist(polymer)
    unit_types = chlist |> Enum.map(fn u -> hd String.to_charlist(String.upcase(to_string([u]))) end) |> MapSet.new()
    all_reacted = unit_types |> Enum.map(fn u ->
      new_p = Enum.reject(chlist, fn x -> same_letter_ignore_case(u, x) end)
      part1_str(to_string(new_p))
    end)
    min_one = all_reacted |> Enum.min_by(fn r -> String.length(r) end)
    String.length(min_one)
  end
end
