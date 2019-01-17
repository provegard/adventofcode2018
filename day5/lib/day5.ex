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
    stack = polymer |> Enum.reduce([], fn x, stack ->
      stack_head = if length(stack) == 0, do: nil, else: hd stack
      if stack_head && different_polarity?(stack_head, x) do
        tl stack
      else
        [x | stack]
      end
    end)
    stack |> Enum.reverse()
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
